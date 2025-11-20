<script>
  import { onMount } from 'svelte';
  
  export let target = 'body';
  
  let portal;
  
  onMount(() => {
    const targetEl = document.querySelector(target);
    if (targetEl && portal) {
      targetEl.appendChild(portal);
    }
    
    return () => {
      if (portal && portal.parentNode) {
        portal.parentNode.removeChild(portal);
      }
    };
  });
</script>

<div bind:this={portal}>
  <slot />
</div>