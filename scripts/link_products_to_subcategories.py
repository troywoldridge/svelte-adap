import json
import psycopg2

DB_CONFIG = {
    'dbname': 'troydb',
    'user': 'troyuser',
    'password': 'Elizabeth71676',
    'host': 'localhost',
    'port': 5432,
}

PRODUCTS_JSONL = 'table_data/products.cleaned.jsonl'
OUTPUT_PRODUCTS = 'table_data/products.linked.jsonl'

def get_categories(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, slug FROM categories")
        return {str(row[0]): {'slug': row[1], 'uuid': str(row[0])} for row in cur.fetchall()}

def get_subcategories(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, slug, category_id FROM subcategories")
        return {
            row[1]: {'uuid': str(row[0]), 'category_id': str(row[2])} for row in cur.fetchall()
        }

def find_subcategory_for_product(product_slug, subcategories):
    # Find subcategory whose slug is a prefix of product_slug
    for sub_slug in subcategories.keys():
        if product_slug.startswith(sub_slug):
            return subcategories[sub_slug]
    return None

def main():
    conn = psycopg2.connect(**DB_CONFIG)
    categories = get_categories(conn)
    subcategories = get_subcategories(conn)

    missing_links = []
    updated_products = []

    with open(PRODUCTS_JSONL, 'r') as f:
        for line in f:
            product = json.loads(line)
            product_slug = product.get('slug', '').lower()

            subcat_data = find_subcategory_for_product(product_slug, subcategories)
            if subcat_data:
                subcat_uuid = subcat_data['uuid']
                cat_id = subcat_data['category_id']
                cat_uuid = categories.get(cat_id, {}).get('uuid')
            else:
                subcat_uuid = None
                cat_uuid = None

            if not cat_uuid or not subcat_uuid:
                missing_links.append({
                    'product_id': product.get('id'),
                    'product_name': product.get('name'),
                    'product_slug': product_slug,
                    'category_uuid_found': cat_uuid is not None,
                    'subcategory_uuid_found': subcat_uuid is not None,
                })

            product['category_uuid'] = cat_uuid
            product['subcategory_uuid'] = subcat_uuid
            updated_products.append(product)

    conn.close()

    with open(OUTPUT_PRODUCTS, 'w') as f_out:
        for p in updated_products:
            f_out.write(json.dumps(p) + '\n')

    print(f"✅ Processed {len(updated_products)} products.")
    if missing_links:
        print(f"⚠️ Warning: {len(missing_links)} products could not be fully linked:")
        for miss in missing_links:
            print(miss)
    else:
        print("🎉 All products linked successfully.")

if __name__ == '__main__':
    main()
