<script lang="ts">
  import Portal from "./Portal.svelte";

  export let text = '';
  
  // Define effect references and their descriptions
  const effectDefinitions = {
    //Neutral definitions
    'heal cleanse': 'debuff that is cleansed when target is healed',
    'dot': 'Damage over Time - Deals damage each turn for a duration',
    'stun': 'Prevents the target from taking actions for a duration',
    'field': 'Area of effect, only one in play at a time. New fields replace old ones.',
    'X': 'Use all mana, effect multiplied by mana used.',
    'aoe': 'Area of Effect - affects all targets',
    'stackable': 'Effect can stack multiple times on the same target',
    'lifesteal': 'Heals the caster for a portion of damage dealt',
    'shield': 'Absorbs damage until depleted',
    'bastion': 'Reduces incoming damage by a percentage',
    'unstackable': 'Effect cannot stack on the same target',
    'debuff': 'Negative effect that hinders the target',
    'debuffed': 'target has a debuff',
    'fleeting': 'Card will be sent to deck grave after 2 turns if not used',
    'active': 'Effect that is active on yourself for certain number of turns',
    'pierce': 'ignores shields and bastions',
    //Death Definitions
    'disease': '1 of 5 disease debuffs',
    'diseased': 'target has a disease debuff',
    'haunt': 'effect activates if the card is discarded',
    //Nature Definitions
    'overheal': 'healing a target beyond their max health triggers effect',
    'flourish': 'grants bonus effect if not hit during period',
    //Ice Definitions
    'freeze': 'target loses speed and takes more damage',
    'taunt': 'must be targeted first by enemies',
    //Void Definitions
    'flux': 'One of the values chosen at random upon casting. If flux card to left and right, trigger all effects',
    'void scar': 'stacks a void scar on target',
    //Time Definitions
    'trap': 'triggered when condition is met',
    //Tech Definitions
    'network': 'can connect network cards together when next to each other to combine effects',
    //Dream Definitions
    'form': 'gain active buffs and debuffs based on current form',
    'confusion': 'target has a chance to target ally instead of enemy',
    'prediction': 'guess enemy\'s next move to gain bonus effect',
    'insight':'stacks gained from wrong predictions or revealing cards'


  };
  
    let showTooltip = false;
    let tooltipContent = '';
    let tooltipElement;
    let tooltipX = 0;
    let tooltipY = 0;

  // Parse text and find references in brackets
  function parseTextWithReferences(inputText) {
    const parts = [];
    const regex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(inputText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: inputText.slice(lastIndex, match.index)
        });
      }
      
      // Add the reference
      const effectKey = match[1].toLowerCase();
      parts.push({
        type: 'reference',
        content: match[1],
        definition: effectDefinitions[effectKey] || 'Unknown effect - hover for more info'
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < inputText.length) {
      parts.push({
        type: 'text',
        content: inputText.slice(lastIndex)
      });
    }
    
    return parts;
  }
  
  $: parsedParts = parseTextWithReferences(text);
  
  function handleMouseEnter(definition, event) {
    tooltipContent = definition;
    showTooltip = true;
    
    tooltipX = event.clientX - (tooltipContent.length * 4); // Approximate centeringRetry
    tooltipY = event.clientY - 40;
  }

  function handleMouseLeave() {
    showTooltip = false;
    tooltipContent = '';
  }
</script>

<span class="tooltip-text">
  {#each parsedParts as part}
    {#if part.type === 'text'}
      {part.content}
    {:else if part.type === 'reference'}
      <span 
        class="effect-reference"
        on:mouseenter={(e) => handleMouseEnter(part.definition, e)}
        on:mouseleave={handleMouseLeave}
        role="button"
        tabindex="0"
      >
        [{part.content}]
      </span>
    {/if}
  {/each}
</span>

{#if showTooltip}
  <Portal>
    <div class="tooltip" style="left: {tooltipX}px; top: {tooltipY}px;">
      {tooltipContent}
    </div>
  </Portal>
{/if}
<style>
  .tooltip-text {
    position: relative;
    display: inline;
  }
  
  .effect-reference {
    position: relative;
    color: #007acc;
    background: rgba(0, 122, 204, 0.1);
    padding: 2px 4px;
    border-radius: 3px;
    cursor: help;
    border: 1px solid rgba(0, 122, 204, 0.3);
    transition: all 0.2s ease;
    font-weight: 600;
    display: inline-block;
  }
  
  .effect-reference:hover {
    background: rgba(0, 122, 204, 0.2);
    border-color: rgba(0, 122, 204, 0.5);
  }
  
.tooltip {
  position: fixed; /* Change from absolute to fixed */
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  max-width: 250px;
  z-index: 9999; /* Increase z-index */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  margin-bottom: 5px;
  font-weight: normal;
}
  
  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #333;
  }
</style>