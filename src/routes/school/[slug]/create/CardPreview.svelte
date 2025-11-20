<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  
  export let cardData;
  export let school;
</script>

<Card {cardData} {school} />