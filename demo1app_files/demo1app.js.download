const demo1App = {
    
    data() {
        return {
            inputTaskDesc: "",
            inputTaskTitle: "",
            toDoList: [
                {
                    title: "Task #1",
                    desc: "Go and buy stuff"
                },
                {
                    title: "Task #2",
                    desc: "Walk the dog"
                }
            ]
        }
    }, 
    methods: {
        addNewItem: function() {
            this.toDoList.push({
                title: this.inputTaskTitle,
                desc: this.inputTaskDesc
            })
            this.inputTaskDesc = ""
            this.inputTaskTitle = ""
        },
        deleteItem: function(index) {
            this.toDoList.splice(index, 1)
        }
    }
}


Vue.createApp(demo1App).mount('#demo1app')