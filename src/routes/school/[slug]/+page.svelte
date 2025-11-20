<script lang="ts">
  import { page } from '$app/stores';
  
  $: schoolName = $page.params.slug;
  $: capitalizedSchool = schoolName.charAt(0).toUpperCase() + schoolName.slice(1);
</script>

<svelte:head>
  <title>{capitalizedSchool} School - Card Database</title>
</svelte:head>

<main>
  <div class="container">
    <header>
      <a href="/" class="back-button">← Back to Schools</a>
      <h1>{capitalizedSchool} School</h1>
      <p>Manage and view {capitalizedSchool} magic cards</p>
    </header>

    <div class="actions">
      <a href="/school/{schoolName}/view" class="action-btn primary">View All Cards</a>
      <a href="/school/{schoolName}/create" class="action-btn secondary">Create New Card</a>
    </div>

    <div class="placeholder">
      <p>Welcome to the {capitalizedSchool} school management page</p>
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

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .action-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    font-weight: 500;
  }

  .primary {
    background: #667eea;
    color: white;
  }

  .primary:hover {
    background: #5a6fd8;
  }

  .secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .secondary:hover {
    background: #667eea;
    color: white;
  }

  .placeholder {
    text-align: center;
    color: #666;
    margin-top: 3rem;
  }
</style>