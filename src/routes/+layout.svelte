<script>
  import '../app.css'; 
  import Navbar from '$lib/components/Navbar.svelte';
  import ShippingBanner from '$lib/components/ShippingBanner.svelte';
  import SocialLinks from '$lib/components/SocialLinks.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  <ShippingBanner />

  <main class="flex-grow">
    <slot />
  </main>

  <SocialLinks />
  <Footer />
</div>
