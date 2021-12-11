import { createStore } from '../../node_modules/vuex';

import user from '../store/modules/user';

const store = createStore({
    modules: {
        user,
    },
})

export default store;