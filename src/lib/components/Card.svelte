<script lang="ts">
  import TooltipText from './TooltipText.svelte';
  
  export let cardData;
  export let school;
  export let showActions = false;
  export let onEdit = null;
  export let onDelete = null;

  // School colors mapping
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

  $: schoolColor = schoolColors[school] || '#667eea';
  
  // Handle different data formats from preview vs database
  $: statsText = cardData.stats_text || (cardData.stats?.text) || '';
  $: cardTypes = Array.isArray(cardData.card_type) 
    ? cardData.card_type 
    : (cardData.card_type || '').split(', ').filter(Boolean);
</script>

<div class="card" style="--school-color: {schoolColor}">
  <div class="card-header">
    <div class="card-name">{cardData.spell_name || 'Spell Name'}</div>
    <div class="mana-cost">{cardData.spell_cost || 0}</div>
  </div>
  
  <div class="card-art">
    {#if cardData.image_url}
      <img src={cardData.image_url} alt={cardData.spell_name} class="card-image" />
    {:else}
      <div class="placeholder-art">🎴</div>
    {/if}
  </div>
  
  <div class="card-type">
    <div class="types-container">
      {#if cardData.subclass}
        <span class="subclass">{cardData.subclass}</span>
      {/if}
      {#each cardTypes as type}
        <span class="type">{type}</span>
      {/each}
    </div>
    {#if cardData.spell_type}
      <span class="spell-type">{cardData.spell_type}</span>
    {/if}
  </div>
  
  <!-- Stats/Effects section with tooltips -->
  <div class="card-stats">
    {#if statsText && statsText.trim()}
      <div class="stats-text">
        {#each statsText.split('\n').filter(line => line.trim()) as statLine}
          <div class="stat-line">
            <TooltipText text={statLine.trim()} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-stats">
        <p>Card effects will appear here...</p>
      </div>
    {/if}
  </div>

  <!-- Description section -->
  {#if cardData.description && cardData.description.trim()}
    <div class="card-description">
      <p><TooltipText text={cardData.description} /></p>
    </div>
  {/if}
  
  <div class="card-footer">
    <div class="card-limit">
      Limit: {cardData.card_limit || 1}
    </div>
  </div>
  
  <!-- Action buttons for view mode -->
  {#if showActions}
    <div class="card-actions">
      <button class="edit-btn" on:click={() => onEdit && onEdit(cardData)}>Edit</button>
      <button class="delete-btn" on:click={() => onDelete && onDelete(cardData.id, cardData.spell_name)}>Delete</button>
    </div>
  {/if}
  
  <div class="school-badge">{school}</div>
</div>

<!-- Keep all the existing styles exactly the same -->
<style>
  .card {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    border: 3px solid var(--school-color);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }

  .card-header {
    background: var(--school-color);
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-name {
    font-weight: bold;
    font-size: 1.3rem;
    flex: 1;
    margin-right: 1rem;
  }

  .mana-cost {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.3rem;
  }

  .card-art {
    height: 180px;
    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid var(--school-color);
    position: relative;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-art {
    font-size: 4rem;
    opacity: 0.3;
  }

  .card-type {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.05);
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .types-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .type {
    background: rgba(255, 255, 255, 0.8);
    color: var(--school-color);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    border: 1px solid var(--school-color);
  }

  .spell-type {
    color: var(--school-color);
    font-weight: bold;
    font-style: italic;
  }

  .card-stats {
    padding: 1.5rem;
    min-height: 100px;
    background: rgba(0, 0, 0, 0.02);
    border-top: 1px solid #eee;
  }

  .stats-text {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #333;
  }

  .stat-line {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-left: 3px solid var(--school-color);
    border-radius: 0 4px 4px 0;
  }

  .stat-line:last-child {
    margin-bottom: 0;
  }

  .no-stats {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 1rem 0;
  }

  .no-stats p {
    margin: 0;
  }

  .card-description {
    padding: 1rem 1.5rem;
    background: rgba(0, 0, 0, 0.03);
    border-top: 1px solid #eee;
    font-style: italic;
    color: #666;
  }

  .card-description p {
    margin: 0;
    line-height: 1.4;
  }

  .card-footer {
    padding: 1rem 1.5rem;
    background: rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
    border-top: 1px solid #eee;
  }

  .card-actions {
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-top: 1px solid #eee;
  }

  .edit-btn, .delete-btn {
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .edit-btn {
    background: #4caf50;
    color: white;
  }

  .edit-btn:hover {
    background: #45a049;
  }

  .delete-btn {
    background: #f44336;
    color: white;
  }

  .delete-btn:hover {
    background: #d32f2f;
  }

  .school-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(255, 255, 255, 0.9);
    color: var(--school-color);
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: bold;
    border: 1px solid var(--school-color);
  }
  .subclass {
  background: var(--school-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  border: 1px solid var(--school-color);
}
</style>