<script lang="ts">
  // Define the schools with their properties
  const schools = [
    { name: 'Death', color: '#2d1b33', icon: '💀' },
    { name: 'Nature', color: '#2d5016', icon: '🌱' },
    { name: 'Void', color: '#1a1a2e', icon: '🌌' },
    { name: 'Time', color: '#4a4a4a', icon: '⏰' },
    { name: 'Tech', color: '#0f3460', icon: '⚙️' },
    { name: 'Dream', color: '#6a0572', icon: '💭' },
    { name: 'Air', color: '#87ceeb', icon: '💨' },
    { name: 'Fire', color: '#d2001f', icon: '🔥' },
    { name: 'Ice', color: '#5dade2', icon: '❄️' },
    { name: 'Balance', color: '#8b4513', icon: '⚖️' }
  ];
</script>

<svelte:head>
  <title>Card Database - Schools of Magic</title>
  <meta name="description" content="Navigate through the schools of magic" />
</svelte:head>

<main>
  <div class="container">
    <header>
      <h1>Schools of Magic</h1>
      <p>Choose a school to explore its cards</p>
    </header>

    <div class="schools-grid">
      {#each schools as school}
        <a 
          href="/school/{school.name.toLowerCase()}" 
          class="school-card"
          style="--school-color: {school.color}"
        >
          <div class="school-icon">{school.icon}</div>
          <h3>{school.name}</h3>
        </a>
      {/each}
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  header p {
    font-size: 1.2rem;
    color: #666;
  }

  .schools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .school-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    background: white;
    border: 2px solid transparent;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .school-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--school-color);
  }

  .school-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--school-color);
  }

  .school-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .school-card h3 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--school-color);
    font-weight: 600;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .schools-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .school-card {
      padding: 1.5rem 0.5rem;
    }
  }
</style>