angular.module('gameApp', [])
    .controller('GameController', function ($interval) {
        var getCount = function (input) {
            var rowSize = Math.pow(2 ^ input.length);
            for (var i = 0; i < input.length; i++) {
                var left = input[i][0];
                var right = input[i][1];
            }
        }

        var game = this;
        var empty = -100;
        var invcount = -3242;
        var currentinterval = 1500;
        var mininterval = 100;
        var stepinterval = 50;
        var timer;

        game.maxPos = {
            x: 10,
            y: 11
        };
        game.position = {
            x: 5,
            y: 0
        };
        game.number = empty;
        game.currentRowPos = game.maxPos.y;
        game.score = 0;
        game.stopped = true;
        game.over = false;

        game.leftRed = "left-red";
        game.leftBlue = "left-blue";
        game.leftYellow = "left-yellow";
        game.rightRed = "right-red";
        game.rightBlue = "right-blue";
        game.rightYellow = "right-yellow";

        game.isObject = function (element) {
            return (typeof (element) == "object");
        }

        function RandomNumber(min, max) {
            Math.seedrandom();
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        game.random = function () {
            Math.seedrandom();
            var currentNumber = RandomNumber(-10, 9);
            if (currentNumber <= -10) {
                Math.seedrandom();
                var currentNumberLeft = RandomNumber(-9, 9);
                Math.seedrandom();
                var currentNumberRight = RandomNumber(-9, 9);
                if (currentNumberLeft == currentNumberRight) {
                    return currentNumberLeft;
                } else {
                    return [currentNumberLeft, currentNumberRight];
                }
            }
            return currentNumber;
        }

        game.computeObejcts = function (input) {
            var rowSize = Math.pow(2, input.length);
            var resultRow = Array(rowSize).fill(0);
            for (var i = 0; i < input.length; i++) {
                var fill_at_a_time = Math.pow(2, input.length - i - 1);
                var how_many = Math.pow(2, i + 1);
                var row = [];
                for (var n = 0; n < how_many; n++) {
                    if (n % 2 == 0) {
                        Array.prototype.push.apply(row, Array(fill_at_a_time).fill(input[i][0]));
                    } else {
                        Array.prototype.push.apply(row, Array(fill_at_a_time).fill(input[i][1]));
                    }
                }
                for (var m = 0; m < row.length; m++) {
                    resultRow[m] += row[m];
                }
            }
            return resultRow;
        }
        game.checkRow = function () {
            var currentRow = game.grid[game.currentRowPos];
            var count = 0;
            var rowLocked = true;
            var objects = [];
            for (var i = 0; i < currentRow.length; i++) {
                if (!game.isObject(currentRow[i])) {
                    count += currentRow[i];
                } else {
                    objects.push(currentRow[i]);
                }

                if (currentRow[i] == empty) {
                    rowLocked = false;
                    break;
                }
            }

            if (objects.length > 0) {
                var resultRow = game.computeObejcts(objects);
                for (var n = 0; n < resultRow.length; n++) {
                    if ((resultRow[n] + count) == 0) {
                        count = 0;
                        break;
                    }
                }
            }

            if (count != 0 && rowLocked) {
                count = invcount;
            }
            return count;
        }

        game.intervalFunc = function () {
            if (game.position.y >= game.maxPos.y) {
                game.step();
                return;
            }

            if (game.grid[game.position.y + 1][game.position.x] != empty) {
                if (game.position.y == 0) {
                    $interval.cancel(timer);
                    game.stopped = true;
                    game.over = true;
                } else {
                    game.step();
                }
            } else {
                game.grid[game.position.y][game.position.x] = empty;
                game.position.y++;
                game.currentRowPos = game.position.y
                game.grid[game.position.y][game.position.x] = game.number;
            }

        };

        game.moveDown = function () {
            if (game.stopped) {
                return;
            }
            var newGrid = [
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty]
            ];
            for (var i = 0; i < game.grid.length; i++) {
                if (i != game.currentRowPos) {
                    newGrid.push(game.grid[i]);
                }
            }
            game.grid = newGrid;
        }

        game.step = function () {
            var count = game.checkRow();
            if (count == 0) {
                game.score++;
                game.moveDown();
                if (currentinterval > mininterval) {
                    currentinterval -= stepinterval;
                    $interval.cancel(timer);
                    timer = $interval(game.intervalFunc, currentinterval);
                }

            } 
            game.position = {
                x: 5,
                y: 0
            };
            game.number = game.random();
            game.grid[game.position.y][game.position.x] = game.number;
        }
        game.startGrid = [
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty, empty]
        ];

        game.grid = JSON.parse(JSON.stringify(game.startGrid));
        game.grid[game.position.y][game.position.x] = game.number;

        game.onStart = function () {
            if (!game.stopped) {
                return;
            }
            game.grid = JSON.parse(JSON.stringify(game.startGrid));
            timer = $interval(game.intervalFunc, currentinterval);
            game.number = game.random();
            game.stopped = false;
            game.over = false;
            game.score = 0;
            game.grid[game.position.y][game.position.x] = game.number;
            game.currentRowPos = game.maxPos.y;
        }

        var right = 39;
        var left = 37;
        var down = 40;
        var up = 38;
        game.up = function () {
            game.step();
        }
        game.right = function () {
            if (game.grid[game.position.y][game.position.x + 1] == empty) {
                game.grid[game.position.y][game.position.x] = empty;
                game.position.x++;
                game.grid[game.position.y][game.position.x] = game.number;
            }
        }

        game.left = function () {
            if (game.grid[game.position.y][game.position.x - 1] == empty) {
                game.grid[game.position.y][game.position.x] = empty;
                game.position.x--;
                game.grid[game.position.y][game.position.x] = game.number;
            }
        }

        game.down = function () {
            game.intervalFunc();
        }

        game.onKeyDown = function (event) {
            if (game.stopped) {
                return;
            }
            switch (event.which) {
                case right:
                    game.right();
                    break;
                case left:
                    game.left();
                    break;
                case down:
                    game.down();
                    break;
                case up:
                    game.up();
            }
        }
    });