<script lang="ts">
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import Card from '$lib/components/Card.svelte';
  
  $: schoolName = $page.params.slug;
  $: capitalizedSchool = schoolName ? schoolName.charAt(0).toUpperCase() + schoolName.slice(1) : '';

  let cards = [];
  let isLoading = true;
  let error = '';
  let searchTerm = '';
  let selectedCardType = '';
  let selectedSubclass = '';

  // Card type options for filtering
  const cardTypeOptions = [
    'attack',
    'crowd control',
    'debuff',
    'support',
    'healing',
    'block'
  ];

  // School colors for consistent styling
  const schoolColors = {
    'Death': '#2d1b33',
    'Nature': '#2d5016', 
    'Void': '#1a1a2e',
    'Time': '#4a4a4a',
    'Tech': '#0f3460',
    'Dream': '#6a0572',
    'Air': '#87ceeb',
    'Fire': '#d2001f',
    'Ice': '#5dade2',
    'Balance': '#8b4513'
  };

  $: schoolColor = schoolColors[capitalizedSchool] || '#667eea';

   // Get unique subclasses from loaded cards
  $: availableSubclasses = [...new Set(cards.map(card => card.subclass).filter(Boolean))];

  // Filtered cards based on search and type filter
  $: filteredCards = cards.filter(card => {
    const matchesSearch = card.spell_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !selectedCardType || card.card_type.includes(selectedCardType);
    const matchesSubclass = !selectedSubclass || card.subclass === selectedSubclass;
    
    return matchesSearch && matchesType && matchesSubclass;
  });

  // Load cards for this school
  async function loadCards() {
    try {
      isLoading = true;
      error = '';

      const { data, error: supabaseError } = await supabase
        .from('cards')
        .select('*')
        .eq('magic_type', capitalizedSchool)
        .order('spell_name');

      if (supabaseError) {
        throw supabaseError;
      }

      cards = data || [];
      console.log(`Loaded ${cards.length} cards for ${capitalizedSchool} school:`, cards);

    } catch (err) {
      console.error('Error loading cards:', err);
      error = `Failed to load cards: ${err.message}`;
    } finally {
      isLoading = false;
    }
  }

  // Edit card (placeholder for now)
  function editCard(card) {
    window.location.href = `/school/${schoolName}/edit/${card.id}`;
  }

  // Delete a card
  async function deleteCard(cardId, cardName) {
    if (!confirm(`Are you sure you want to delete "${cardName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (deleteError) {
        throw deleteError;
      }

      // Remove from local array
      cards = cards.filter(card => card.id !== cardId);
      alert(`"${cardName}" has been deleted successfully.`);

    } catch (err) {
      console.error('Error deleting card:', err);
      alert(`Failed to delete card: ${err.message}`);
    }
  }

  // Load cards when component mounts or school changes
  onMount(loadCards);
  $: if (capitalizedSchool) {
    loadCards();
  }
</script>

<svelte:head>
  <title>View {capitalizedSchool} Cards - Card Database</title>
</svelte:head>

<main>
  <div class="container">
    <header>
      <a href="/school/{schoolName}" class="back-button">← Back to {capitalizedSchool} School</a>
      <h1>{capitalizedSchool} Cards</h1>
      <p>Browse and manage all {capitalizedSchool} magic cards</p>
    </header>

    <!-- Search and Filter Controls -->
<div class="controls">
  <div class="search-section">
    <input 
      type="text" 
      bind:value={searchTerm}
      placeholder="Search cards by name or description..."
      class="search-input"
    />
  </div>
  
  <div class="filter-section">
    <select bind:value={selectedCardType} class="filter-select">
      <option value="">All Card Types</option>
      {#each cardTypeOptions as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </div>

  <div class="filter-section">
    <select bind:value={selectedSubclass} class="filter-select">
      <option value="">All Subclasses</option>
      {#each availableSubclasses as subclass}
        <option value={subclass}>{subclass}</option>
      {/each}
    </select>
  </div>

  <div class="actions">
    <a href="/school/{schoolName}/create" class="create-btn" style="--school-color: {schoolColor}">
      + Create New Card
    </a>
  </div>
</div>

    <!-- Loading State -->
    {#if isLoading}
      <div class="loading">
        <p>Loading {capitalizedSchool} cards...</p>
      </div>
    
    <!-- Error State -->
    {:else if error}
      <div class="error">
        <p>{error}</p>
        <button on:click={loadCards} class="retry-btn">Retry</button>
      </div>
    
    <!-- No Cards State -->
    {:else if filteredCards.length === 0 && cards.length === 0}
      <div class="empty-state">
        <h3>No cards found</h3>
        <p>There are no {capitalizedSchool} cards in the database yet.</p>
        <a href="/school/{schoolName}/create" class="create-btn" style="--school-color: {schoolColor}">
          Create the first {capitalizedSchool} card
        </a>
      </div>
    
    <!-- Filtered Results Empty -->
    {:else if filteredCards.length === 0}
      <div class="empty-state">
        <h3>No matching cards</h3>
        <p>No cards match your current search and filter criteria.</p>
        <button on:click={() => { searchTerm = ''; selectedCardType = ''; }} class="clear-filters-btn">
          Clear Filters
        </button>
      </div>
    
    <!-- Cards Grid -->
    {:else}
      <div class="results-header">
        <p>Showing {filteredCards.length} of {cards.length} cards</p>
      </div>
      
      <div class="cards-grid">
        {#each filteredCards as card}
          <Card 
            cardData={card} 
            school={capitalizedSchool} 
            showActions={true}
            onEdit={editCard}
            onDelete={deleteCard}
          />
        {/each}
      </div>
    {/if}
  </div>
</main>

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .back-button {
    display: inline-block;
    color: #667eea;
    text-decoration: none;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .controls {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: end;
  }

  .search-input {
    padding: 0.75rem;
    border: 2px solid #e1e1e1;
    border-radius: 6px;
    font-size: 1rem;
    width: 100%;
  }

  .search-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .filter-select {
    padding: 0.75rem;
    border: 2px solid #e1e1e1;
    border-radius: 6px;
    font-size: 1rem;
    background: white;
  }

  .create-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--school-color);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .create-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .loading, .error, .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .error {
    border-left: 4px solid #f44336;
  }

  .retry-btn, .clear-filters-btn {
    padding: 0.5rem 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .results-header {
    margin-bottom: 1rem;
    color: #666;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    justify-items: center;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .controls {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .cards-grid {
      grid-template-columns: 1fr;
    }
  }
</style>