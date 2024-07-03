import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useStore = defineStore('mainStore', {
    state: () => ({
        postsArray: [],
        commentsArray: [],
        modalShow: false,
    }),
    getters: {
        posts: (state) => state.postsArray,
    },
    actions: {
        getPosts() {
            axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
                this.postsArray = response.data;
            });
        },
        getComments() {
            axios.get('https://jsonplaceholder.typicode.com/comments').then((response) => {
                this.commentsArray = response.data;
            });
        },
    },
});
