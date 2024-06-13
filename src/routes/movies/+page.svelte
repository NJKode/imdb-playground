<script lang="ts">
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	const columnChoices = [
		{
			id: 'title',
			text: 'Title',
		},
		{
			id: 'startYear',
			text: 'Release year',
		},
		{
			id: 'runTime',
			text: 'Run time',
		},
		{
			id: 'averageRating',
			text: 'Rating',
		},
		{
			id: 'numVotes',
			text: 'Number of Votes',
		},
	];

	const orderChoices = [
		{
			id: 'ASC',
			text: 'Ascending',
		},
		{
			id: 'DESC',
			text: 'Descending',
		},
	];

	export let data: PageData;

	$: ({ queryResults } = data);

	const params = $page.url.searchParams;
	let order = params.get('order') || 'ASC';
	let sortBy = params.get('sort_by') || 'startYear';

	function onSubmit() {
		const params = $page.url.searchParams;
		params.set('order', order);
		params.set('sort_by', sortBy);
		goto(`?${params.toString()}`, {
			invalidateAll: true,
		});
	}
</script>

<a href="/">Return home</a>

<h1>Movies</h1>

<form on:submit|preventDefault={onSubmit}>
	<select bind:value={sortBy}>
		{#each columnChoices as choice}
			<option value={choice.id}>
				{choice.text}
			</option>
		{/each}
	</select>

	<select bind:value={order}>
		{#each orderChoices as choice}
			<option value={choice.id}>
				{choice.text}
			</option>
		{/each}
	</select>

	<button type="submit"> Search </button>
</form>

<table>
	<thead>
		<td> Title </td>
		<td> Year </td>
		<td> Run time (minutes) </td>
		<td> Score </td>
		<td> Number of Votes </td>
	</thead>
	<tbody>
		{#each queryResults as [title, year, runTime, score, numVotes]}
			<tr>
				<td>
					{title}
				</td>
				<td>
					{year}
				</td>
				<td>
					{runTime}
				</td>
				<td>
					{score}
				</td>
				<td>
					{numVotes?.toLocaleString()}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
