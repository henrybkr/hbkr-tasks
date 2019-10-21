import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        taskList: [
            {
              'id': 0,
              'title': "One Lorem ipsum dolor sit amet",
              'completed': false,
              'editing': false,
              'added': "2019.10.15",
              'lastEdit': false
            },
            {
              'id': 1,
              'title': "Two Lorem ipsum dolor sit amet",
              'completed': true,
              'editing': false,
              'added': "2019.10.15",
              'lastEdit': false
            },
          ]
    }
})