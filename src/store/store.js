import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Note to self, not currently using vuex.

export const store = new Vuex.Store({
    state: {
      ListData: [
				{
					listOrder: 0,
					name: 'Shopping List',
					itemArr: [
						{
							order: 2,
							title: 'New Desktop PC'
						},
						{
							order: 0,
							title: 'Updated Smartphone'
            },
            {
							order: 3,
							title: 'This is a test task used to showcase that the div extends when the user types a task that is longer than the more common "one line" title task. Pretty cool right?'
						},
						{
							order: 1,
							title: 'HQ headphones'
						}
					]
				},
				{
					listOrder: 2,
					name: 'Movies to watch',
					itemArr: [
						{
							order: 0,
							title: 'Inception'
						},
						{
							order: 1,
							title: 'King Kong'
						},
					]
				},
				{
					listOrder: 1,
					name: 'TV shows to watch',
					itemArr: [
						{
							order: 0,
							title: 'Breaking Bad'
						},
						{
							order: 1,
							title: 'Narcos'
						},
						{
							order: 2,
							title: '30 Rock'
						},
						{
							order: 3,
							title: 'The Simpsons'
						},
						{
							order: 4,
							title: 'Game of Thrones'
						}
					]
        },
        {
					listOrder: 0,
					name: 'Shopping List',
					itemArr: [
						{
							order: 2,
							title: 'New Desktop PC'
						},
						{
							order: 0,
							title: 'Updated Smartphone'
            },
            {
							order: 3,
							title: 'This is a test task used to showcase that the div extends when the user types a task that is longer than the more common "one line" title task. Pretty cool right?'
						},
						{
							order: 1,
							title: 'HQ headphones'
						}
					]
				},
				{
					listOrder: 2,
					name: 'Movies to watch',
					itemArr: [
						{
							order: 0,
							title: 'Inception'
						},
						{
							order: 1,
							title: 'King Kong'
						},
					]
				},
				{
					listOrder: 1,
					name: 'TV shows to watch',
					itemArr: [
						{
							order: 0,
							title: 'Breaking Bad'
						},
						{
							order: 1,
							title: 'Narcos'
						},
						{
							order: 2,
							title: '30 Rock'
						},
						{
							order: 3,
							title: 'The Simpsons'
						},
						{
							order: 4,
							title: 'Game of Thrones'
						}
					]
				},
				
      ],
      
    },
    getters: {
      getListItems: state => state.ListData
    },
    mutations: {
      //addListItem: state => 
    }
})