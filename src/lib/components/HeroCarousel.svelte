<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let slides = [
    {
      image: 'https://imagedelivery.net/pJ0fKvjCAbyoF8aD0BGu8Q/e13479be-444b-4c40-0579-6bf38d78f800/public',
      headline: 'Need Cards Fast?',
      subtext: '24-Hour Turnaround on Select Business Cards',
      cta: 'Shop Quick Ship Cards',
      link: '/shop/quick-ship-cards'
    },
    {
      image: 'https://imagedelivery.net/pJ0fKvjCAbyoF8aD0BGu8Q/ad05b619-6f97-41df-666e-7e01c5833000/public',
      headline: 'Cut to Shape Magnets',
      subtext: 'Custom magnets, cut to any shape',
      cta: 'Explore Magnets',
      link: '/shop/magnets'
    },
    {
      image: 'https://imagedelivery.net/pJ0fKvjCAbyoF8aD0BGu8Q/30a4292d-bf6b-4924-1509-bfe341d38f00/public',
      headline: 'Summer Sale is On',
      subtext: 'Save up to 30% on select print essentials',
      cta: 'Shop the Sale',
      link: '/sale'
    },
    {
      image: 'https://imagedelivery.net/pJ0fKvjCAbyoF8aD0BGu8Q/2e1a8c28-be09-49f9-1fbc-4b4866bffa00/public',
      headline: 'Fresh Designs. Bold Prints.',
      subtext: 'New Products Added Weekly',
      cta: "Check What’s New",
      link: '/new-arrivals'
    }
  ];

  let current = 0;
  let interval: ReturnType<typeof setInterval>;

  const next = () => {
    current = (current + 1) % slides.length;
  };

  const prev = () => {
    current = (current - 1 + slides.length) % slides.length;
  };

  onMount(() => {
    interval = setInterval(next, 5000); // 5 sec autoplay
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  function goToSlide(i: number) {
    current = i;
    clearInterval(interval);
    interval = setInterval(next, 5000); // reset timer on manual nav
  }
</script>

<div class="relative overflow-hidden h-[400px] md:h-[500px] w-full select-none">
  {#each slides as slide, index}
    <div
      class="absolute inset-0 transition-opacity duration-700 ease-in-out"
      class:opacity-100={index === current}
      class:opacity-0={index !== current}
      style="z-index: {index === current ? 10 : 0}"
      aria-hidden={index !== current}
    >
      <img
        src={slide.image}
        alt={slide.headline}
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-6 md:px-16"
      >
        <h2 class="text-2xl md:text-5xl font-extrabold drop-shadow-lg">{slide.headline}</h2>
        <p class="mt-2 text-md md:text-xl max-w-3xl drop-shadow-md">{slide.subtext}</p>
        <a
          href={slide.link}
          class="mt-6 inline-block bg-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg"
          >{slide.cta}</a
        >
      </div>
    </div>
  {/each}

  <!-- Prev / Next buttons -->
  <button
    on:click={prev}
    aria-label="Previous slide"
    class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    &#10094;
  </button>
  <button
    on:click={next}
    aria-label="Next slide"
    class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    &#10095;
  </button>

  <!-- Dots -->
  <div
    class="absolute bottom-4 w-full flex justify-center space-x-3"
    role="tablist"
    aria-label="Select slide"
  >
    {#each slides as _, i}
      <button
        on:click={() => goToSlide(i)}
        aria-selected={i === current}
        role="tab"
        aria-label={`Go to slide ${i + 1}`}
        class="w-4 h-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        class:bg-white={i === current}
        class:bg-gray-400={i !== current}
      />
    {/each}
  </div>
</div>

<style>
  div[style] {
    transition: opacity 0.7s ease-in-out;
  }

  button.w-4 {
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
  }
</style>
