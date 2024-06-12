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
				label: 'cool',
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			tooltip: {
				callbacks: {
					label: function (ctx) {
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

<h1>Top rated movies per year</h1>

<div>
	<Scatter data={chartData} options={chartOptions}></Scatter>
</div>
