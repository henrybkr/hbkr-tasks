<template>
	<div class="fullpage">
		<div class="container">
			
			<h2 class="pt-4 display-4 pb-0">Great, you made it!</h2>
			<p class="lead">Welcome to Henry's task management application.</p>
			<hr class="my-4 line-dim">
			<p class="pb-4">This is a Vue.JS based application which offers users the ability to set and manage tasks. The idea is to simplify requirements for a developer by making them both definable and achievable.</p>
			
		</div>
		
			<div class="jumbotron bg-dark rounded-0">
				<div class="container text-light">
					<h3 class="display-4 smallerTitle pb-0">Project Aims</h3>
					<p class="lead">This project is a learning project but in order go beyond a simple task list typically found in tutorials, I've set myself the following requirements:</p>
					
					<ul class="no-bullets">
						<li><input type="checkbox" class="mr-2" disabled="disabled" checked="checked">List of tasks that can be managed and edited (add/rename/delete)</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled" checked="checked">Mark separate tasks as complete and delete multiple tasks together</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled" checked="checked">"Pin" important tasks to display higher in the list</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled" checked="checked">Store and allow the manipulation of task data via external database</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled">Load task list securely from a custom RESTful API</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled" checked="checked">Produce basic filters (display only complete tasks, etc)</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled" checked="checked">Delete all complete tasks easily</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled">Create amd display multiple lists with a custom list name on a per-user basis</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled">Personal task lists should be secured via account authentication</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled">RESTful api should be secured to only display list data about an authenticated user</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled">Mobile-first presentation of the application</li>
						<li><input type="checkbox" class="mr-2" disabled="disabled">Allow the user to drag and drop task list ordering</li>
					</ul>
					<hr class="my-4 line-dim">
					<p class="lead">Follow the project via:</p>
					<a class="btn btn-light btn-lg mr-2" href="https://github.com/henrybkr/hbkr-tasks" target="_blank" role="button"><font-awesome-icon class="mr-2" :icon="[ 'fab', 'github' ]" height="30px"/>GitHub</a>
					<a class="btn btn-light btn-lg" href="http://hbkr.space" target="_blank" role="button"><img class="mylogo mr-2" src='~@/assets/images/logo_dark_hbkr.svg' height="30px" />Personal Site</a>
				</div>
			</div>
		
	</div>
</template>
<script>

export default {
	name: 'Home',
		components: {
			
		}
}
</script>

<style scoped>
	h2 { padding: 5px; padding-top: 20px; padding-bottom: 20px; }
	p { padding: 5px; }
	.smallerTitle { font-size: 30pt; }
	.line-dim { border-color: rgba(255, 255, 255, 0.2) !important; }
	.no-bullets { list-style: none; }
	.mylogo { margin-top: -5px;}
	.fullpage { min-height: calc(100vh - 75px)}
</style>