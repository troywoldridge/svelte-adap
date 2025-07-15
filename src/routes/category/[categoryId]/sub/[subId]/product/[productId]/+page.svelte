<script lang="ts">
	export let data: {
		product: {
			id: number;
			name: string;
		} | null;
		subcategory: {
			id: number;
			name: string;
		} | null;
		category: {
			id: number;
			name: string;
		} | null;
	};
</script>

<svelte:head>
	<title>{data.product?.name ?? 'Product Not Found'} | ADAP</title>
	<meta name="description" content={`Product page for ${data.product?.name ?? 'unknown product'}`} />
</svelte:head>

<div class="max-w-6xl mx-auto p-4">
	{#if data.product && data.subcategory && data.category}
		<nav class="text-sm text-gray-500 mb-4">
			<a class="hover:underline" href="/">Home</a> /
			<a class="hover:underline" href={`/category/${data.category.id}`}>{data.category.name}</a> /
			<a class="hover:underline" href={`/category/${data.category.id}/sub/${data.subcategory.id}`}>
				{data.subcategory.name}
			</a> /
			<span class="text-black font-medium">{data.product.name}</span>
		</nav>

		<h1 class="text-3xl font-bold mb-2">{data.product.name}</h1>

		<section class="mt-4 space-y-4">
			<!-- Placeholder for product images -->
			<div class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
				Product Image
			</div>

			<!-- Placeholder for product description -->
			<p class="text-gray-700">
				This is the detail page for <strong>{data.product.name}</strong>. You can add size options,
				pricing, stock status, spec sheets, and more here.
			</p>

			<!-- Placeholder for future price/options -->
			<div class="mt-6">
				<button
					class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
				>
					Add to Cart
				</button>
			</div>
		</section>
	{:else}
		<div class="text-center text-red-500 mt-10">
			<h2 class="text-2xl font-semibold">Product not found</h2>
			<p class="mt-2">Please check the URL or go back to the category page.</p>
			<a href="/" class="text-blue-600 underline mt-4 inline-block">← Back to Home</a>
		</div>
	{/if}
</div>
