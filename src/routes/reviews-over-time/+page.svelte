<script lang="ts">
	import type { PageData } from './$types';
	import 'chart.js/auto';
	import { Scatter } from 'svelte-chartjs';

	export let data: PageData;
	const { queryResults } = data;
	const dataset = queryResults.map(([title, year, score, numVotes]) => {
		return {
			x: parseInt(year),
			y: parseFloat(score),
			title,
			numVotes,
		};
	});

	const chartData = {
		datasets: [
			{
				data: dataset,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: function (ctx: any) {
						let title = ctx.raw.title;
						return [`${title} (${ctx.raw.x})`, `Score: ${ctx.raw.y} (${ctx.raw.numVotes} votes)`];
					},
				},
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Year',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Average user score',
				},
			},
		},
	};
</script>

<a href="/">Return home</a>

<h1>Top rated movies per year</h1>

<div>
	<Scatter data={chartData} options={chartOptions}></Scatter>
</div>

<table>
	<thead>
		<td> Title </td>
		<td> Year </td>
		<td> Score </td>
		<td> Number of Votes </td>
	</thead>
	<tbody>
		{#each queryResults as [title, year, score, numVotes]}
			<tr>
				<td>
					{title}
				</td>
				<td>
					{year}
				</td>
				<td>
					{score}
				</td>
				<td>
					{numVotes.toLocaleString()}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
