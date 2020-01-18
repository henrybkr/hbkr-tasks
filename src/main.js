import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store/store'
// Bootstrap
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBookmark, faLockOpen, faFlask, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fab, faBookmark, faLock, faFlask, faLockOpen)
Vue.component('font-awesome-icon', FontAwesomeIcon)

//

//

// Event bus
window.eventBus = new Vue();

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')


// show/hide horizontal/vertical list modes on bootstrap breakpoint (mobile vs standard view)

import bsBreakpoints from 'bs-breakpoints'

bsBreakpoints.init();						// init
bsBreakpoints.detectBreakpoint();			// detect
bsBreakpoints.getCurrentBreakpoint();		// Return the current active responsive breakpoint
alert(bsBreakpoints.getCurrentBreakpoint());
/* init not working for some reason */

/* // Not currently used
$(window).on('init.bs.breakpoint', function (e) {
	var lol = e.breakpoint
	this.console.warn(lol)
  })

$(window).on('new.bs.breakpoint', function (e) {
	// on change
	
}) */

// When a resize is detected, wait for the user to finish resizing the window then launch function.
$(window).resize(function() {
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function(){
        updateListDisplayMode();
    }, 250);
});

// 
function updateListDisplayMode() {
	let current = bsBreakpoints.getCurrentBreakpoint();

	if (current == "small" || current == "xSmall") {
		//alert("okay, this should be set to vertical mode")
		$("#hor-list").addClass("d-none");
		$("#ver-list").removeClass("d-none");
	}
	else {
		//alert("should be horizontal")
		$("#ver-list").addClass("d-none");
		$("#hor-list").removeClass("d-none");
	}
	console.log("true")
}

// Run once immediately
