<script lang="ts">
  import { page } from '$app/stores';
  import CardPreview from './CardPreview.svelte';
  import { supabase } from '$lib/supabase';
  
  $: schoolName = $page.params.slug;
  $: capitalizedSchool = schoolName ? schoolName.charAt(0).toUpperCase() + schoolName.slice(1) : '';

  // Add some debugging
  $: console.log('School name:', schoolName, 'Capitalized:', capitalizedSchool);

    const subclassOptions = {
      'Death': ['Death', 'Plaguebearer', 'Tombcaller'],
      //plaguebearer: diseases
      //tombcaller: sacrifice cards for effects and pull from grave
      'Nature': ['Nature', 'Vitalist', 'Haruspex'],
      //Vitalist: healing and buffs
      //Haruspex: Blood magoc, sacrifice health for effects and healing teammates
      'Fire': ['Fire', 'Hellbrand', 'Ashwreaker'],
      //Hellbrand: massive damage, maintain meter or damage yourself
      //Ashwreaker: damage over time, burning effects, accuracy debuffs, slow burn class
      'Ice': ['Ice', 'Frostmason', 'Cryosentinel'],
      //Frostmason: defensive class, shields, bastions, 
      //Cryosentinel: freezes, slows, taunts, self health increase
      'Air': ['Air', 'Zephyr', 'Tempest'],
      //Zephyr: speed buffs, evasion, agility based effects
      //Tempest: AoE, chaining lightning effects, storm based effects
      'Time': ['Time', 'Schemer', 'Chronomancer'],
      //Schemer: traps, delayed effects, setup plays
      //Chronomancer: stuns, enemy disruption
      'Tech': ['Tech', 'Archanic', 'Technician'],
      //Archanic: combine cards for big effects
      //Technician: upgrading buffs, enhancing cards, support
      'Dream': ['Dream', 'Seer', 'Shapeshifter'],
      //Seer: reveal cards, guess enemies next moves for bonus effects
      //Shapeshifter: bonuses for continuously shifting forms, confusion effects
      'Void': ['Void', 'Voidsleight', 'Corrupter'],
      //Voidsleight: random values, luck
      //Corrupter: Stacking effects
    };

  // Card type options
  const cardTypeOptions = [
    'attack',
    'crowd control',
    'debuff',
    'support',
    'healing',
    'block'
  ];

  // Card data that will update in real-time
  let cardData = {
    spell_name: '',
    description: '',
    magic_type: '', // Start empty, we'll set it reactively
    subclass: '',
    spell_cost: '',
    card_type: [],
    stats_text: '',
    card_limit: 1,
    spell_type: '',
    crafting_recipe: {},
    image_url: ''
  };

  $: availableSubclasses = subclassOptions[capitalizedSchool] || [];


  // Set magic_type reactively
  $: if (capitalizedSchool) {
    cardData.magic_type = capitalizedSchool;
  }

  // Form state
  let selectedCardTypes = [];
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';

  // Update card_type array
  $: cardData.card_type = selectedCardTypes;

  // Handle card type selection
  function toggleCardType(type) {
    if (selectedCardTypes.includes(type)) {
      selectedCardTypes = selectedCardTypes.filter(t => t !== type);
    } else {
      selectedCardTypes = [...selectedCardTypes, type];
    }
  }

  // Save card to database
  async function saveCard() {
    isLoading = true;
    errorMessage = '';
    successMessage = '';

    try {
      // Validate required fields
      if (!cardData.spell_name.trim()) {
        throw new Error('Spell name is required');
      }
      if (selectedCardTypes.length === 0) {
        throw new Error('At least one card type must be selected');
      }
      if (!cardData.magic_type) {
        throw new Error('Magic type is missing');
      }

      // Parse spell_cost to handle both numbers and text like "X"
      let parsedSpellCost;
      if (cardData.spell_cost === '' || cardData.spell_cost === null) {
        parsedSpellCost = 0;
      } else if (isNaN(cardData.spell_cost)) {
        parsedSpellCost = 0;
      } else {
        parsedSpellCost = Number(cardData.spell_cost);
      }

      // Prepare data for database - ensure all required fields are present
      const cardToSave = {
        spell_name: cardData.spell_name.trim(),
        description: cardData.description.trim() || null,
        magic_type: cardData.magic_type, // Make sure this is not undefined
        subclass: cardData.subclass || null,
        spell_cost: parsedSpellCost,
        card_type: selectedCardTypes.join(', '),
        stats: cardData.stats_text.trim() ? { text: cardData.stats_text.trim() } : null,
        card_limit: cardData.card_limit || 1,
        spell_type: cardData.spell_type.trim() || null,
        crafting_recipe: null,
        image_url: cardData.image_url.trim() || null
      };

      // Debug log
      console.log('Card data before save:', cardToSave);
      console.log('Magic type specifically:', cardToSave.magic_type);

      const { data, error } = await supabase
        .from('cards')
        .insert([cardToSave])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Card saved successfully:', data);
      successMessage = `Card "${cardData.spell_name}" created successfully!`;
      
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      errorMessage = error.message;
      console.error('Error saving card:', error);
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    cardData = {
      spell_name: '',
      description: '',
      magic_type: capitalizedSchool, // Reset to current school
      spell_cost: '',
      card_type: [],
      stats_text: '',
      card_limit: 1,
      spell_type: '',
      crafting_recipe: {},
      image_url: ''
    };
    selectedCardTypes = [];
    successMessage = '';
    errorMessage = '';
  }

  function cancelCreation() {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      window.history.back();
    }
  }
</script>

<svelte:head>
  <title>Create Card - {capitalizedSchool} School</title>
</svelte:head>

<main>
  <div class="container">
    <header>
      <a href="/school/{schoolName}" class="back-button">← Back to {capitalizedSchool} School</a>
      <h1>Create New {capitalizedSchool} Card</h1>
    </header>

    <div class="creator-layout">
      <!-- Left side - Card Preview -->
      <div class="preview-section">
        <h2>Card Preview</h2>
        <CardPreview {cardData} school={capitalizedSchool} />
      </div>

      <!-- Right side - Form -->
      <div class="form-section">
        <h2>Card Details</h2>
        <div class="form-container">
          
          <!-- Spell Name -->
          <label>
            Spell Name *
            <input 
              bind:value={cardData.spell_name} 
              placeholder="Enter spell name..." 
              required 
            />
          </label>
          
          <!-- Description -->
          <label>
            Description
            <textarea 
              bind:value={cardData.description} 
              placeholder="Enter detailed card description..."
              rows="4"
            ></textarea>
          </label>
          
          <!-- Magic Type (readonly, filled by school) -->
          <label>
            Magic Type
            <input 
              bind:value={cardData.magic_type} 
              readonly 
              class="readonly-field"
              placeholder="Should auto-fill with school name..."
            />
            <small class="help-text">Current school: {schoolName} → {capitalizedSchool}</small>
          </label>

          <!-- Subclass -->
          <label>
            Subclass
            <select bind:value={cardData.subclass}>
              <option value="">Choose a subclass...</option>
              {#each availableSubclasses as subclass}
                <option value={subclass}>{subclass}</option>
              {/each}
            </select>
          </label>
          
          <!-- Spell Cost -->
          <label>
            Spell Cost
            <input 
              bind:value={cardData.spell_cost} 
              placeholder="Enter cost (number or X)"
            />
          </label>
          
          <!-- Card Type (multi-select checkboxes) -->
          <fieldset class="card-type-fieldset">
            <legend>Card Type * (Select one or more)</legend>
            <div class="checkbox-grid">
              {#each cardTypeOptions as type}
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedCardTypes.includes(type)}
                    on:change={() => toggleCardType(type)}
                  />
                  <span class="checkbox-text">{type}</span>
                </label>
              {/each}
            </div>
          </fieldset>
          
          <!-- Stats -->
<label>
  Card Effects & Stats
  <textarea 
    bind:value={cardData.stats_text}
    placeholder="Enter card effects, one per line (use [brackets] for references):
Take 50% more damage for 3 turns
25% of damage received is placed as a [DOT] on selected target
Apply [Heal Cleanse] to all allies
Target takes [Burn] damage for 5 turns
[Shield] absorbs next 100 damage"
    rows="6"
  ></textarea>
  <small class="help-text">
    Enter each effect on a separate line. Use [brackets] around effect names to show tooltips on hover.
    <br>Examples: [Heal Cleanse], [DOT], [Stun], [Poison], [Shield], [Regeneration]
  </small>
</label>
          
          <!-- Card Limit -->
          <label>
            Card Limit
            <input 
              type="number" 
              bind:value={cardData.card_limit} 
              min="1" 
              placeholder="1"
            />
          </label>
          
          <!-- Spell Type -->
          <label>
            Spell Type
            <input 
              bind:value={cardData.spell_type} 
              placeholder="e.g., Instant, Ritual, Enchantment"
            />
          </label>
          
          <!-- Crafting Recipe (placeholder) -->
          <label>
            Crafting Recipe
            <input 
              value="Select from database (coming soon)" 
              readonly 
              class="readonly-field disabled"
            />
          </label>
          
          <!-- Image URL -->
          <label>
            Image URL
            <input 
              type="url"
              bind:value={cardData.image_url} 
              placeholder="https://example.com/image.jpg"
            />
          </label>
          
        </div>
        
        <!-- Messages -->
        {#if errorMessage}
          <div class="message error-message">
            {errorMessage}
          </div>
        {/if}
        
        {#if successMessage}
          <div class="message success-message">
            {successMessage}
          </div>
        {/if}
        
        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            class="save-btn" 
            on:click={saveCard}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Card'}
          </button>
          <button 
            class="cancel-btn" 
            on:click={cancelCreation}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 1600px;
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

  .creator-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    min-height: 750px;
  }

  .preview-section, .form-section {
    background: white;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .preview-section h2, .form-section h2 {
    margin-top: 0;
    margin-bottom: 2rem;
    color: #333;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: 500;
    font-size: 1.1rem;
  }

  input, textarea {
    padding: 1rem;
    border: 2px solid #e1e1e1;
    border-radius: 6px;
    font-size: 1.1rem;
    transition: border-color 0.3s ease;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .readonly-field {
    background-color: #f5f5f5;
    color: #666;
  }

  .disabled {
    opacity: 0.6;
  }

  .card-type-fieldset {
    border: 2px solid #e1e1e1;
    border-radius: 6px;
    padding: 1rem;
  }

  .card-type-fieldset legend {
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0 0.5rem;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: normal;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .checkbox-label:hover {
    background-color: #f0f0f0;
  }

  .checkbox-label input[type="checkbox"] {
    padding: 0;
    margin: 0;
    width: 18px;
    height: 18px;
  }

  .help-text {
    font-size: 0.9rem;
    color: #666;
    font-weight: normal;
    margin-top: 0.25rem;
  }

  .message {
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .error-message {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #e57373;
  }

  .success-message {
    background-color: #e8f5e8;
    color: #2e7d32;
    border: 1px solid #81c784;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .save-btn, .cancel-btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .save-btn {
    background: #4caf50;
    color: white;
  }

  .save-btn:hover:not(:disabled) {
    background: #45a049;
  }

  .save-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .cancel-btn {
    background: #f44336;
    color: white;
  }

  .cancel-btn:hover:not(:disabled) {
    background: #d32f2f;
  }

  .card-stats {
  padding: 1.5rem;
  min-height: 120px;
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.stats-text {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #333;
}

.stat-line {
  margin-bottom: 0.75rem;
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
  padding: 2rem 0;
}

.no-stats p {
  margin: 0;
}

  /* Responsive design */
  @media (max-width: 1200px) {
    .creator-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .container {
      max-width: 95%;
    }
  }
</style>