import { createStore } from 'vuex';
import state from './modules/state';


const store = createStore({
    strict: true,
 state,
 mutations: {},
 actions: {},
    modules: {
        state,
    },
})

export default store;
