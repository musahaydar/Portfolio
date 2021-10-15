var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HomeScreen = function (_React$Component) {
    _inherits(HomeScreen, _React$Component);

    function HomeScreen(props) {
        _classCallCheck(this, HomeScreen);

        return _possibleConstructorReturn(this, (HomeScreen.__proto__ || Object.getPrototypeOf(HomeScreen)).call(this, props));
    }

    _createClass(HomeScreen, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "homeScreen" },
                React.createElement(
                    "div",
                    null,
                    "Auto Scheduler is a web application that helps you plan out your day to improve productivity. Click the button below to get started."
                ),
                React.createElement("hr", null),
                React.createElement(
                    "button",
                    { "class": "btn btn-primary btn-lg btn-block", onClick: this.props.createSchedule },
                    "Create Schedule"
                ),
                this.props.exists ? React.createElement(
                    "button",
                    { "class": "btn btn-success btn-lg btn-block", onClick: this.props.resumeHandler },
                    "Resume Schedule"
                ) : React.createElement(
                    "button",
                    { "class": "btn btn-secondary btn-lg btn-block" },
                    "Resume Schedule"
                )
            );
        }
    }]);

    return HomeScreen;
}(React.Component);

var ScheduleBuilder = function (_React$Component2) {
    _inherits(ScheduleBuilder, _React$Component2);

    function ScheduleBuilder(props) {
        _classCallCheck(this, ScheduleBuilder);

        // Break length and frequency are in seconds
        // Break frequency refers to how long a task can be before adding a break
        var _this2 = _possibleConstructorReturn(this, (ScheduleBuilder.__proto__ || Object.getPrototypeOf(ScheduleBuilder)).call(this, props));

        _this2.state = {
            numTasks: 1,
            tasks: [ScheduleBuilder.createTask()],
            midTaskBreakLength: 600,
            betweenTaskBreakLength: 900,
            breakFreqHours: 1,
            breakFreqMins: 0
        };

        _this2.addTask = _this2.addTask.bind(_this2);
        _this2.reset = _this2.reset.bind(_this2);
        _this2.processSchedule = _this2.processSchedule.bind(_this2);

        // Form input handlers
        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.updateSettings = _this2.updateSettings.bind(_this2);
        return _this2;
    }

    // Creates a new task object for the state to hold


    _createClass(ScheduleBuilder, [{
        key: "addTask",


        // Adds a new task input to the form
        value: function addTask(event) {
            event.preventDefault();
            this.setState(function (state) {
                return {
                    numTasks: state.numTasks + 1,
                    tasks: [].concat(_toConsumableArray(state.tasks), [ScheduleBuilder.createTask()])
                };
            });
        }

        // Reset the schedule builder

    }, {
        key: "reset",
        value: function reset() {
            this.setState({
                numTasks: 1,
                tasks: [ScheduleBuilder.createTask()]
            });
        }

        // Process the schedule and pass schedule to the container component

    }, {
        key: "processSchedule",
        value: function processSchedule(event) {
            var _this3 = this;

            event.preventDefault();

            // User input data lives in the state
            // Use it to create an appropriate schedule
            var schedule = {
                tasks: []
            };

            // Deep clone the tasks list
            var inputList = JSON.parse(JSON.stringify(this.state.tasks));

            // Compute task durations in seconds
            inputList.forEach(function (element) {
                element.duration = element.hrs * 3600 + element.mins * 60;
            });

            // Sort tasks based on urgency, breaking ties with longer tasks first
            inputList.sort(function (a, b) {
                if (a.urgency > b.urgency) {
                    return 1;
                } else if (a.urgency < b.urgency) {
                    return -1;
                } else {
                    // break ties using task duration
                    if (a.duration > b.duration) {
                        return -1;
                    }
                    return 1;
                }
            });

            // Compute the break frequency in seconds
            var breakFreq = this.state.breakFreqHours * 3600 + this.state.breakFreqMins * 60;
            var lastUrgency = 0;

            // Create the schedule data structure
            var currentTaskID = 0;
            inputList.forEach(function (task) {
                // Skip tasks with no duration
                if (task.duration === 0) {
                    return;
                }

                // If this isn't the first task, add a break between tasks
                // This break will have the same task ID as the subsequent task
                // If the user specified 0 as the between-task break length, do nothing
                if (currentTaskID !== 0 && _this3.state.betweenTaskBreakLength !== 0) {
                    schedule.tasks.push({
                        name: "Break",
                        duration: _this3.state.betweenTaskBreakLength,
                        urgency: lastUrgency,
                        id: currentTaskID,
                        status: "pending"
                    });
                }

                // Split tasks that are too long
                // Don't split tasks if the user specified a mid-task break length of 0
                while (task.breaks === true && task.duration > breakFreq && _this3.state.midTaskBreakLength !== 0) {
                    // Push back the max duration for part of the task
                    schedule.tasks.push({
                        name: task.name,
                        duration: breakFreq,
                        urgency: task.urgency,
                        id: currentTaskID,
                        status: "pending"
                    });
                    // Update the remaining task duration
                    task.duration -= breakFreq;
                    // Push back a break
                    schedule.tasks.push({
                        name: "Mid-Task Break",
                        duration: _this3.state.midTaskBreakLength,
                        urgency: task.urgency,
                        id: currentTaskID,
                        status: "pending"
                    });
                }

                // Push back the task
                schedule.tasks.push({
                    name: task.name,
                    duration: task.duration,
                    urgency: task.urgency,
                    id: currentTaskID,
                    status: "pending"
                });

                currentTaskID++;
                // Use this task's urgency for the urgency of the subsequent break
                lastUrgency = task.urgency;
            });

            // console.log(schedule);        

            this.props.makeSchedule(schedule);
        }

        // Form's calls this onKeyPress to prevent entry key from submitting form

    }, {
        key: "preventEnterKeySubmit",
        value: function preventEnterKeySubmit(event) {
            // 13 is enter key
            if (event.which === 13) {
                event.preventDefault();
            }
        }
    }, {
        key: "updateSettings",
        value: function updateSettings(event) {
            event.preventDefault();
            if (event.target.id === "settings-mtb") {
                this.setState({
                    midTaskBreakLength: event.target.value * 60
                });
            } else if (event.target.id === "settings-btb") {
                this.setState({
                    betweenTaskBreakLength: event.target.value * 60
                });
            } else if (event.target.id === "settings-freq-hrs") {
                this.setState({
                    breakFreqHours: event.target.value
                });
            } else if (event.target.id === "settings-freq-mins") {
                this.setState({
                    breakFreqMins: event.target.value
                });
            }
        }

        // Updates state for form value change

    }, {
        key: "handleChange",
        value: function handleChange(event) {
            var id = event.target.id;
            var value = event.target.value;

            // Get input type
            var input_type = id.split('-')[0];
            // Get the numeric id
            var id_num = id.split('-')[1];

            // Update the value
            // This forces the state to update and re-render
            if (input_type === "breaks") {
                this.state.tasks[id_num][input_type] = !this.state.tasks[id_num][input_type];
            } else {
                this.state.tasks[id_num][input_type] = value;
            }
            this.forceUpdate();
        }
    }, {
        key: "render",
        value: function render() {
            // Add rows to the table based on the number of tasks specified
            var rows = [];
            for (var i = 0; i < this.state.numTasks; ++i) {
                rows.push(React.createElement(
                    "div",
                    { "class": "form-row" },
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-3" },
                        React.createElement("input", { type: "text", "class": "form-control", id: "name-" + i, value: this.state.tasks[i].name, onChange: this.handleChange })
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-2" },
                        React.createElement("input", { type: "number", "class": "form-control", id: "hrs-" + i, min: "0", max: "100", value: this.state.tasks[i].hrs, onChange: this.handleChange })
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-2" },
                        React.createElement("input", { type: "number", "class": "form-control", id: "mins-" + i, min: "0", max: "100", value: this.state.tasks[i].mins, onChange: this.handleChange })
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-3" },
                        React.createElement(
                            "select",
                            { "class": "form-control urgent", id: "urgency-" + i, value: this.state.tasks[i].urgency, onChange: this.handleChange },
                            React.createElement(
                                "option",
                                { value: "1" },
                                "Very Urgent"
                            ),
                            React.createElement(
                                "option",
                                { value: "2" },
                                "Somewhat Urgent"
                            ),
                            React.createElement(
                                "option",
                                { value: "3" },
                                "Not Urgent"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-check col-md-2" },
                        React.createElement("input", { "class": "form-check-input", value: "", type: "checkbox", id: "breaks-" + i, checked: this.state.tasks[i].breaks, onChange: this.handleChange })
                    )
                ));
            };

            return React.createElement(
                "div",
                { id: "scheduleBuilder" },
                React.createElement(
                    "h3",
                    null,
                    "Schedule Builder"
                ),
                React.createElement("br", null),
                React.createElement(
                    "div",
                    { id: "scheduleBuilderTitle" },
                    "Build your list of tasks in the table below. Auto Scheduler will automatically order and display your tasks when you hit the \"Start Schedule\" button. Tasks are sorted by urgency level, with longer tasks given priority.",
                    React.createElement("hr", null)
                ),
                React.createElement(
                    "form",
                    { onKeyPress: this.preventEnterKeySubmit },
                    React.createElement(
                        "table",
                        { id: "scheduleBuilderTable" },
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-3" },
                                "Task Name"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-4" },
                                "Duration (hours : mins)"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-3" },
                                "Urgency"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-2" },
                                "Add Break"
                            )
                        ),
                        rows.map(function (value, index) {
                            return value;
                        }),
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement("br", null)
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement(
                                "button",
                                { "class": "btn btn-primary form-group col-md-3", onClick: this.addTask },
                                "Add Another Task"
                            ),
                            React.createElement("div", { "class": "form-group col-md-2" }),
                            React.createElement(
                                "button",
                                { "class": "btn btn-danger form-group col-md-3", type: "reset", onClick: this.reset },
                                "Reset Schedule"
                            ),
                            React.createElement(
                                "button",
                                { "class": "btn btn-success form-group col-md-3", onClick: this.processSchedule },
                                "Start Schedule"
                            )
                        ),
                        React.createElement("hr", null)
                    ),
                    React.createElement(
                        "h3",
                        null,
                        "Settings"
                    ),
                    React.createElement(
                        "table",
                        { id: "settingsTable" },
                        React.createElement(
                            "div",
                            { "class": "form-group row" },
                            React.createElement(
                                "label",
                                { "for": "settings-mtb", "class": "col-form-label col-md-7" },
                                "Mid-task break duration (mins)"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-row col-md" },
                                React.createElement("input", { type: "number", "class": "form-control", id: "settings-mtb", value: this.state.midTaskBreakLength / 60, min: "0", onChange: this.updateSettings })
                            )
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-group row" },
                            React.createElement(
                                "label",
                                { "for": "settings-freq-hrs", "class": "col-form-label col-md-7" },
                                "Time before mid-task breaks (hrs:mins)"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-row col-md" },
                                React.createElement("input", { type: "number", "class": "form-control", id: "settings-freq-hrs", min: "0", max: "100", value: this.state.breakFreqHours, onChange: this.updateSettings })
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-row col-md" },
                                React.createElement("input", { type: "number", "class": "form-control", id: "settings-freq-mins", min: "0", max: "100", value: this.state.breakFreqMins, onChange: this.updateSettings })
                            )
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-group row" },
                            React.createElement(
                                "label",
                                { "for": "settings-btb", "class": "col-form-label col-md-7" },
                                "Between-task break duration (mins):"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-row col-md" },
                                React.createElement("input", { type: "number", "class": "form-control", id: "settings-btb", value: this.state.betweenTaskBreakLength / 60, min: "0", onChange: this.updateSettings })
                            )
                        )
                    )
                ),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null)
            );
        }
    }], [{
        key: "createTask",
        value: function createTask() {
            var task = {
                name: "New Task",
                hrs: 1,
                mins: 0,
                urgency: 1,
                breaks: true
            };

            return task;
        }
    }]);

    return ScheduleBuilder;
}(React.Component);

var ScheduleDisplay = function (_React$Component3) {
    _inherits(ScheduleDisplay, _React$Component3);

    function ScheduleDisplay(props) {
        _classCallCheck(this, ScheduleDisplay);

        var _this4 = _possibleConstructorReturn(this, (ScheduleDisplay.__proto__ || Object.getPrototypeOf(ScheduleDisplay)).call(this, props));

        _this4.updateTimer = _this4.updateTimer.bind(_this4);
        _this4.checkTask = _this4.checkTask.bind(_this4);
        _this4.markTaskAsDone = _this4.markTaskAsDone.bind(_this4);
        _this4.finishSchedule = _this4.finishSchedule.bind(_this4);
        _this4.closeSchedule = _this4.closeSchedule.bind(_this4);

        _this4.acceptPopup = _this4.acceptPopup.bind(_this4);
        _this4.addTime = _this4.addTime.bind(_this4);
        _this4.reschedule = _this4.reschedule.bind(_this4);

        var time = 0;
        if (_this4.props.resume) {
            time = _this4.props.elapsedTime;
        }

        // Deep copy the schedule into this components state
        _this4.state = {
            elapsedTime: time,
            schedule: JSON.parse(JSON.stringify(_this4.props.schedule)),
            showPopup: false,
            popupTask: {},
            popupTaskNum: 0,
            popupObject: null,
            timer: setInterval(_this4.updateTimer, 1000)
        };

        // Initalize the schedule to start immediately
        // Set the first task to ongoing
        if (!_this4.props.resume) {
            _this4.state.schedule.tasks[0].status = "ongoing";
        }
        return _this4;
    }

    _createClass(ScheduleDisplay, [{
        key: "updateTimer",
        value: function updateTimer() {
            // Add a second to the elapsed time
            this.setState(function (state) {
                return {
                    elapsedTime: state.elapsedTime + 1
                };
            });
            // Save the state to local storage
            localStorage.setItem("schedule", JSON.stringify(this.state.schedule));
            localStorage.setItem("elapsedTime", JSON.stringify(this.state.elapsedTime));
            // console.log("Saved timer: " + this.state.elapsedTime);
        }

        // Event handler for "I'm done with this task" button 

    }, {
        key: "markTaskAsDone",
        value: function markTaskAsDone() {
            var _this5 = this;

            var foundOngoing = false;
            var completed = false;
            // Loop until we find the ongoing task
            this.state.schedule.tasks.forEach(function (task) {
                if (task.status === "ongoing") {
                    foundOngoing = true;
                    // Mark the task as completed
                    task.status = "completed";
                    // Reset the timer
                    _this5.state.elapsedTime = 0;
                    completed = true;
                }
                // Mark the next task as ongoing if we completed the previous one
                else if (foundOngoing && completed) {
                        task.status = "ongoing";
                        completed = false;
                    }
            });

            // If there was not an ongoing tasks, we've finished the schdule
            if (!foundOngoing) {
                this.finishSchedule();
            }

            // Make sure the popup is disabled
            this.state.popupObject = null;
            this.state.showPopup = false;

            // Force an update to the component since we have updated state
            this.forceUpdate();
        }
    }, {
        key: "finishSchedule",
        value: function finishSchedule() {
            // Remove any state from localStorge
            localStorage.removeItem("schedule");
            localStorage.removeItem("elapsedTime");
            this.closeSchedule();
        }
    }, {
        key: "closeSchedule",
        value: function closeSchedule() {
            clearInterval(this.state.timer);
            // Call endSchedule to return to home screen
            this.props.endSchedule();
        }
    }, {
        key: "checkTask",
        value: function checkTask() {
            var _this6 = this;

            var updatedState = false;
            var foundOngoing = false;
            var completed = false;
            var counter = 0;
            // Loop until we find the ongoing task
            this.state.schedule.tasks.forEach(function (task) {
                if (task.status === "ongoing") {
                    foundOngoing = true;
                    // Check if the duration is less than the elapsed time
                    if (task.duration <= _this6.state.elapsedTime) {
                        // Mark the task as completed
                        task.status = "completed";
                        updatedState = true;
                        // Reset the timer
                        _this6.state.elapsedTime = 0;
                        completed = true;
                        // Create the popup
                        _this6.state.popupTask = JSON.parse(JSON.stringify(task));
                        _this6.state.showPopup = true;
                        _this6.state.popupTaskNum = counter;
                        // Set the pop-up to clear after 30 seconds
                        _this6.state.popupObject = setTimeout(_this6.acceptPopup, 30000);
                        // Play ding sound on popup
                        var ding = new Audio("audio/ding.mp3");
                        ding.play();
                    }
                }
                // Mark the next task as ongoing if we completed the previous one
                else if (foundOngoing && completed) {
                        task.status = "ongoing";
                        completed = false;
                    }
                // Increment counter to store task list index
                counter += 1;
            });

            // If there was not an ongoing tasks, we've finished the schdule
            if (!foundOngoing) {
                this.finishSchedule();
            }

            // Force an update to the component since if we have updated state
            if (updatedState) {
                this.forceUpdate();
            }
        }

        // Functions for the post-task popup

    }, {
        key: "acceptPopup",
        value: function acceptPopup() {
            this.setState({
                showPopup: false,
                popupObject: null
            });
        }
    }, {
        key: "addTime",
        value: function addTime() {
            // Insert a new task (same as task that just ended w/ 30 min duration)
            this.state.schedule.tasks.splice(this.state.popupTaskNum + 1, 0, {
                name: this.state.popupTask.name + " (+30 mins)",
                status: "ready",
                duration: 1800,
                urgency: this.state.popupTask.urgency,
                id: this.state.popupTask.currentTaskID
            });

            // Set the ready task to ongoing and ongoing task
            this.state.schedule.tasks.forEach(function (task) {
                if (task.status === "ready") {
                    task.status = "ongoing";
                } else if (task.status === "ongoing") {
                    task.status = "pending";
                }
            });

            // Remove the popup
            this.state.popupObject = null;
            this.state.showPopup = false;

            // Force the task to update
            this.forceUpdate();
        }

        // Function for popup
        // Create a new task that is identical to this, and put it as the last task with this urgency level

    }, {
        key: "reschedule",
        value: function reschedule() {
            var _this7 = this;

            // If we don't find a task with lower urgency, reschedule to the last task
            var rescheduleIndex = this.state.schedule.tasks.length;
            var idx = 0;
            // only reschedule this task for after the next ongoing task
            var foundOngoing = false;
            this.state.schedule.tasks.forEach(function (task) {
                if (task.status === "ongoing") {
                    foundOngoing = true;
                } else if (foundOngoing && task.urgency > _this7.state.popupTask.urgency) {
                    rescheduleIndex = idx;
                }
                idx++;
            });

            this.state.schedule.tasks.splice(rescheduleIndex, 0, {
                name: this.state.popupTask.name + " (rescheduled)",
                status: "pending",
                duration: this.state.popupTask.duration,
                urgency: this.state.popupTask.urgency,
                id: this.state.popupTask.currentTaskID
            });

            // Remove the popup
            this.state.popupObject = null;
            this.state.showPopup = false;

            // Force the task to update
            this.forceUpdate();
        }
    }, {
        key: "render",
        value: function render() {
            var _this8 = this;

            // Call checkTasks before rendering
            this.checkTask();

            // Compute the sections of the timer
            var taskTimer = 0;
            var elapsedHours = parseInt(this.state.elapsedTime / 3600);
            var elapsedMins = parseInt(this.state.elapsedTime % 3600 / 60);
            if (elapsedMins < 10) {
                elapsedMins = "0" + elapsedMins;
            }
            var elapsedSecs = parseInt(this.state.elapsedTime % 60);
            if (elapsedSecs < 10) {
                elapsedSecs = "0" + elapsedSecs;
            }

            return React.createElement(
                "div",
                { id: "scheduleDisplay" },
                React.createElement(
                    "h3",
                    null,
                    "Schedule"
                ),
                this.state.showPopup && React.createElement(TaskPopup, {
                    taskname: this.state.popupTask.name,
                    accept: this.acceptPopup,
                    addTime: this.addTime,
                    reschedule: this.reschedule
                }),
                React.createElement(
                    "div",
                    { id: "scheduleHeader" },
                    React.createElement(
                        "p",
                        null,
                        "Time elapsed for this task: ",
                        elapsedHours,
                        ":",
                        elapsedMins,
                        ":",
                        elapsedSecs
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-primary col-md-3", onClick: this.markTaskAsDone },
                        "I'm done with this task"
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-danger col-md-3", onClick: this.closeSchedule },
                        "End schedule early"
                    )
                ),
                React.createElement("br", null),
                React.createElement(
                    "table",
                    { "class": "table" },
                    React.createElement(
                        "thead",
                        null,
                        React.createElement(
                            "tr",
                            { "class": "schedule-row" },
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "Task Name"
                            ),
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "Duration (Hours : Mins)"
                            )
                        )
                    ),
                    React.createElement(
                        "tbody",
                        null,
                        this.state.schedule.tasks.map(function (value, index) {
                            var classText = "";
                            taskTimer = value.duration;
                            if (value.status === "ongoing") {
                                classText = "table-primary";
                                taskTimer = value.duration - _this8.state.elapsedTime;
                            } else if (value.status === "completed") {
                                classText = "table-success";
                            } else {
                                // "pending"
                                classText = "table-warning";
                            }

                            return React.createElement(
                                "tr",
                                { "class": "schedule-row " + classText },
                                React.createElement(
                                    "td",
                                    { scope: "col" },
                                    value.name
                                ),
                                React.createElement(
                                    "td",
                                    { scope: "col" },
                                    parseInt(taskTimer / 3600),
                                    ":",
                                    parseInt(taskTimer % 3600 / 60) >= 10 ? parseInt(taskTimer % 3600 / 60) : "0" + parseInt(taskTimer % 3600 / 60),
                                    ":",
                                    parseInt(taskTimer % 3600 % 60) >= 10 ? parseInt(taskTimer % 3600 % 60) : "0" + parseInt(taskTimer % 3600 % 60)
                                )
                            );
                        })
                    )
                ),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null)
            );
        }
    }]);

    return ScheduleDisplay;
}(React.Component);

var TaskPopup = function (_React$Component4) {
    _inherits(TaskPopup, _React$Component4);

    function TaskPopup(props) {
        _classCallCheck(this, TaskPopup);

        return _possibleConstructorReturn(this, (TaskPopup.__proto__ || Object.getPrototypeOf(TaskPopup)).call(this, props));
    }

    _createClass(TaskPopup, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "taskPopup" },
                React.createElement(
                    "p",
                    null,
                    "Did u finish ",
                    this.props.taskname,
                    "?"
                ),
                React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "button",
                        { "class": "btn btn-success", onClick: this.props.accept },
                        "Yes!"
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-secondary", onClick: this.props.reschedule },
                        "Reschedule for Later"
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-secondary", onClick: this.props.addTime },
                        " Add 30 Minutes"
                    )
                )
            );
        }
    }]);

    return TaskPopup;
}(React.Component);

// parent react component
// contains the state of the scheduler and renders the components


var AutoScheduler = function (_React$Component5) {
    _inherits(AutoScheduler, _React$Component5);

    function AutoScheduler(props) {
        _classCallCheck(this, AutoScheduler);

        var _this10 = _possibleConstructorReturn(this, (AutoScheduler.__proto__ || Object.getPrototypeOf(AutoScheduler)).call(this, props));

        _this10.state = {
            scheduleExists: false,
            schedule: {},
            elapsedTime: 0,
            currentScreen: "HomeScreen",
            resume: false
        };

        _this10.openScheduleBuilder = _this10.openScheduleBuilder.bind(_this10);
        _this10.makeSchedule = _this10.makeSchedule.bind(_this10);
        _this10.endSchedule = _this10.endSchedule.bind(_this10);
        _this10.resumeSchedule = _this10.resumeSchedule.bind(_this10);
        _this10.loadLocalSchedule = _this10.loadLocalSchedule.bind(_this10);
        return _this10;
    }

    _createClass(AutoScheduler, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.loadLocalSchedule();
        }

        // Attempt to load a schedule from disk, and updtate state accordingly

    }, {
        key: "loadLocalSchedule",
        value: function loadLocalSchedule() {
            // Check the local storage to see if a schedule already exists
            var localSchedule = JSON.parse(localStorage.getItem("schedule"));
            var localElapsedTime = JSON.parse(localStorage.getItem("elapsedTime"));

            if (localSchedule !== null && localSchedule !== undefined && localSchedule["tasks"] !== undefined) {
                // If the schedule exists, load it
                this.setState({
                    scheduleExists: true,
                    schedule: localSchedule,
                    elapsedTime: localElapsedTime
                });
            }

            this.forceUpdate();
        }

        // Remove this module from the DOM 
        // Load the schedule builder component

    }, {
        key: "openScheduleBuilder",
        value: function openScheduleBuilder() {
            this.setState({
                currentScreen: "ScheduleBuilder"
            });
        }

        // Adds the schedule to this componenets state
        // Prepares the scheduleDisplay component

    }, {
        key: "makeSchedule",
        value: function makeSchedule(schedule) {
            this.setState({
                schedule: schedule,
                currentScreen: "ScheduleDisplay"
            });
        }

        // Ends the schedule, returns to the main menu

    }, {
        key: "endSchedule",
        value: function endSchedule(schedule) {
            this.setState({
                schedule: {},
                currentScreen: "HomeScreen",
                resume: false
            });
            this.loadLocalSchedule();
        }

        // Resume the schedule from localStorage

    }, {
        key: "resumeSchedule",
        value: function resumeSchedule() {
            this.setState({
                currentScreen: "ScheduleDisplay",
                resume: true
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "container" },
                this.state.currentScreen === "HomeScreen" && React.createElement(HomeScreen, {
                    exists: this.state.scheduleExists,
                    createSchedule: this.openScheduleBuilder,
                    resumeHandler: this.resumeSchedule
                }),
                this.state.currentScreen === "ScheduleBuilder" && React.createElement(ScheduleBuilder, {
                    makeSchedule: this.makeSchedule
                }),
                this.state.currentScreen === "ScheduleDisplay" && React.createElement(ScheduleDisplay, {
                    resume: this.state.resume,
                    elapsedTime: this.state.elapsedTime,
                    schedule: this.state.schedule,
                    endSchedule: this.endSchedule
                })
            );
        }
    }]);

    return AutoScheduler;
}(React.Component);

ReactDOM.render(React.createElement(AutoScheduler, null), document.getElementById('reactEntry'));