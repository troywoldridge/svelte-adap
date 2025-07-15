<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  type Subcategory = {
    id: number;
    name: string;
    categoryId: number;
  };

  type CategoryWithSubs = {
    id: number;
    name: string;
    created_at?: string;
    subcategories: Subcategory[];
  };

  let menu: CategoryWithSubs[] = [];
  let openIndex: number | null = null;

  onMount(async () => {
    if (!browser) return;

    const res = await fetch('/api/navbar');
    menu = await res.json();
  });

  const toggleDropdown = (index: number) => {
    openIndex = openIndex === index ? null : index;
  };

  const closeDropdown = () => {
    openIndex = null;
  };

  function isMobile(): boolean {
    if (!browser) return false;
    return window.innerWidth < 768;
  }
</script>

<nav class="bg-white border-b border-gray-200 shadow-sm z-50 relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <!-- Logo area could go here -->
      <div class="flex flex-wrap items-center gap-4">
        {#each menu as category, i}
          <div
            class="relative group"
            on:mouseenter={() => !isMobile() && (openIndex = i)}
            on:mouseleave={() => !isMobile() && closeDropdown()}
          >
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              on:click={() => isMobile() && toggleDropdown(i)}
            >
              {category.name}
            </button>

            {#if category.subcategories.length}
              <div
                class={`absolute left-0 mt-2 w-56 bg-white rounded shadow-md border border-gray-100 z-50
                ${openIndex === i ? 'block' : 'hidden'}`}
              >
                <ul class="py-1">
                  {#each category.subcategories as sub}
                    <li>
                      <a
                        href={`/category/${category.id}/sub/${sub.id}`}
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sub.name}
                      </a>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</nav>

<style>
  @media (max-width: 768px) {
    nav .group > div.absolute {
      position: static;
      margin-top: 0;
    }

    nav .group > div.absolute.hidden {
      display: none;
    }

    nav .group > div.absolute.block {
      display: block;
    }
  }
</style>
