<script>
  const socials = [
    { name: "Facebook", href: "#", icon: "M18 2h-3a6 6 0 0 0-6 6v3H6v4h3v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h3z" },
    { name: "Twitter", href: "#", icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.06 9.06 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.72 4.12A12.8 12.8 0 0 1 1.67 2.15 4.48 4.48 0 0 0 3.13 8.54a4.41 4.41 0 0 1-2.05-.56v.06a4.52 4.52 0 0 0 3.62 4.44 4.42 4.42 0 0 1-2.04.08 4.52 4.52 0 0 0 4.21 3.13 9.04 9.04 0 0 1-5.59 1.92 9.36 9.36 0 0 1-1.08-.06A12.8 12.8 0 0 0 7 21c8.27 0 12.79-6.85 12.79-12.79 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z" },
    { name: "Instagram", href: "#", icon: "M16 8a6 6 0 1 1-8 0 6 6 0 0 1 8 0zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M20 3h-3.17a4.78 4.78 0 0 0-1.12-.24H12a4 4 0 0 0-1.1.15H7.17A4.91 4.91 0 0 0 3 7.17V20a4 4 0 0 0 4 4h9.83A4 4 0 0 0 20 20V7a4 4 0 0 0-4-4z" },
  ];
</script>

<section class="py-8 bg-gray-50 text-center">
  <div class="max-w-7xl mx-auto flex justify-center space-x-8">
    {#each socials as social}
      <a href={social.href} aria-label={social.name} target="_blank" rel="noopener" class="text-gray-600 hover:text-blue-600 transition-colors">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" >
          <path d={social.icon} />
        </svg>
      </a>
    {/each}
  </div>
</section>
