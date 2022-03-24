
(function () {
    var cells = document.getElementsByClassName('cell'); // 获取所有格子元素
    var cells = document.getElementsByClassName('cell'); // 获取所有格子元素
    var notEmptyCells = document.getElementsByClassName('notEmptyCell'); //获取所有非空元素
    var btn = document.getElementsByTagName('button');  // 获取按钮元素
    // 获取两个表示分数的元素并初始化
    var maxN = document.querySelector('.maxNumber');
    var currentN = document.querySelector('.currentNumber');
    maxN.innerHTML = 0;
    currentN.innerHTML = 0;
    var model = document.querySelector('.model'); //获取模态框元素

    // 初始化
    var temp = 0; //存储当前分数
    var maxTemp = 0; //存储最高分
    if (localStorage.getItem('maxTemp')) {
        maxTemp = parseInt(localStorage.getItem('maxTemp'));
    } else {
        localStorage.setItem('maxTemp', maxTemp);
    }

    // 控制是否产生新格子
    var isNewCell = false;

    init(); // 页面一家在就初始化

    // 1.获得一个随机数为2或4的格子
    function getRandomCell() {
        // 生成随机数 2或4
        var randomNumber = (Math.random() <= 0.5) ? 2 : 4;
        // console.log(randomNumber);

        // 随机选择一个空格子存放数字，并删除表示空盒子的类名
        var emptyCells = document.getElementsByClassName('emptyCell');  // 选择所有空格子元素
        let newCell = Math.floor(Math.random() * (emptyCells.length - 1)); //随机选择一个空格子
        // console.log(randomNumber);
        // console.log(emptyCells.length,emptyCells);
        // 设置短路运算，防止报错
        (emptyCells[newCell] != undefined) && (emptyCells[newCell].innerHTML = randomNumber);
        // 添加一个标记为非空格子的类名，移除表示空格子的类名
        (emptyCells[newCell] != undefined) && emptyCells[newCell].classList.replace('emptyCell', 'notEmptyCell');
    };

    // 2.初始化
    function init() {
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove('notEmptyCell');
            cells[i].innerHTML = '';
            // 遍历所有格子，清除非空格子标记，同时清除内容
        };
        for (let j = 0; j < cells.length; j++) {
            cells[j].classList.add('emptyCell');
            // 所有空格子重新添加上标记
        };
        getRandomCell();
        getRandomCell();
        refreshColor();

        // 当前游戏分数清零
        currentN.innerHTML = 0;
    };

    // 3.给按钮绑定事件，初始化
    btn[0].addEventListener('click', () => {
        init();
        refreshColor();
    });

    // 4.游戏的核心在于移动
    // 移动有四个方向：上、下、左、右。实现思路如下：
    //  如果触发向左移动
    // 　　遍历所有非空元素
    // 　　　　如果当前元素在第一个位置
    //            不动
    // 　　　　如果当前元素不在第一个位置
    // 　　　　　　如果当前元素左侧是空元素    
    //                向左移动
    // 　　　　　　如果当前元素左侧是非空元素    
    // 　　　　　　　　如果左侧元素和当前元素的内容不同    
    //                  不动
    // 　　　　　　　　如果左侧元素和当前元素的内容相同    
    //                  向左合并

    // 4.1 PC端的方向键监听事件
    document.body.addEventListener('keydown', function (e) {
        // keyCode属性已经弃用
        switch (e.key) {
            // left
            case 'ArrowLeft':
                console.log('left');
                move('left');
                isGameOver();
                break;
            // up
            case 'ArrowUp':
                console.log('up');
                move('up');
                isGameOver();
                break;
            // right
            case 'ArrowRight':
                console.log('right');
                move('right');
                isGameOver();
                break;
            // down
            case 'ArrowDown':
                console.log('down');
                move('down');
                isGameOver();
                break;
        }
        // console.log(e);
    });

    // 4.2 玩家进行操作发生移动时，遍历所有非空元素
    function move(direction) {

        // console.log(notEmptyCells);

        // 如果按下的方向键是向左或向上，则正向遍历非空元素；反之，则逆向遍历
        // 原理：跟存取东西一样，猜测和数据结构有关，队列？向上向左是先进先出，向下向右是后进先出
        if (direction == 'left' || direction == 'up') {
            for (let i = 0; i < notEmptyCells.length; i++) {
                cellMove(notEmptyCells[i], direction);
            };
        } else if (direction == 'right' || direction == 'down') {
            for (let i = notEmptyCells.length - 1; i >= 0; i--) {
                cellMove(notEmptyCells[i], direction);
            }
        }

        if (isNewCell) {
            getRandomCell();
            refreshColor();
        }
    }

    // 4.3 根据格子所处的位置、该移动方向有没有其他格子、格子上的数字是否相同，判断是否移动以及数字合成
    function cellMove(currentCell, direction) {
        // 获取该移动方向上的前一个元素
        var sideCell = getSideCell(currentCell, direction);
        if (sideCell === undefined) {
            // 不动，前方没有格子了
        } else if (sideCell.innerHTML == '') { //当前方是空格子时，移动格子
            // 赋值，移除与添加类名标记
            sideCell.innerHTML = currentCell.innerHTML;
            currentCell.innerHTML = '';
            sideCell.classList.replace('emptyCell', 'notEmptyCell');
            currentCell.classList.replace('notEmptyCell', 'emptyCell');

            // 前方还有空格子时，继续调用
            cellMove(sideCell, direction);
            isNewCell = true; // 有移动则产生一个新格子

        } else if (sideCell.innerHTML != currentCell.innerHTML) {  // 当前方不是空格子，且数字不同时
            // 不动，数字不同
        } else { //数字相同时，合并格子（两个格子数字变化、移除与添加类名标记）
            sideCell.innerHTML = (sideCell.innerHTML - 0) * 2;
            currentCell.innerHTML = '';
            sideCell.classList.replace('emptyCell', 'notEmptyCell');
            currentCell.classList.replace('notEmptyCell', 'emptyCell');

            // 前方还有相同数字的格子，继续调用
            cellMove(sideCell, direction);

            // 合并格子后，相应的分数变化
            temp += (sideCell.innerHTML - 0) * 10;
            localStorage.maxTemp = temp;
            currentN.innerHTML = temp;
            // console.log(temp);
            // console.log('myScore', localStorage.getItem('myScore'));
            // 判断最高分与当前分高低，将高者保存到localStorage中
            maxTemp = maxTemp > temp ? maxTemp : temp;
            maxN.innerHTML = maxTemp;

            isNewCell = true; // 合并之后产生一个盒子
        }

    }


    // 4.4 获取该移动方向上前面一个元素（该方向前方是否还有元素，到边上没有）
    function getSideCell(currentCell, direction) {
        // 获取当前元素的坐标
        // console.log('currentCell',currentCell);
        let currentCellX = currentCell.getAttribute('data-x') - 0;
        let currentCellY = currentCell.getAttribute('data-y') - 0;

        // 根据方向获取旁边元素的位置
        switch (direction) {
            case 'left':
                var sideCellX = currentCellX;
                var sideCellY = currentCellY - 1;
                break;
            case 'right':
                var sideCellX = currentCellX;
                var sideCellY = currentCellY + 1;
                break;
            case 'up':
                var sideCellX = currentCellX - 1;
                var sideCellY = currentCellY;
                break;
            case 'down':
                var sideCellX = currentCellX + 1;
                var sideCellY = currentCellY;
                break;
        };

        // 通过自定义属性data-x与data-y组合，再和类名中的坐标匹配获取旁边的节点元素
        var sideCell = document.getElementsByClassName(('x' + sideCellX + 'y' + sideCellY))[0];
        // console.log('sideCell',sideCell);
        return sideCell;
    };

    // 4.5 判定游戏是否结束
    //     获取所有元素
    // 获取所有非空元素
    // 如果所有元素的个数 == 所有非空元素的个数
    // 　　循环遍历所有非空元素
    // 　　　　上面元素存在 && (当前元素的内容 == 上面元素的内容)   return
    // 　　　　下面元素存在 && (当前元素的内容 == 下面元素的内容)   return
    // 　　　　左边元素存在 && (当前元素的内容 == 左边元素的内容)   return
    // 　　　　右边元素存在 && (当前元素的内容 == 右边元素的内容)   return
    // 　 以上条件都不满足，Game Over! 
    function isGameOver() {
        var notEmptyCells = document.getElementsByClassName('notEmptyCell'); //获取所有非空元素

        if (cells.length == notEmptyCells.length) {
            for (let i = 0; i < notEmptyCells.length; i++) {
                var tempCell = notEmptyCells[i];
                if (getSideCell(tempCell, 'up') !== undefined && (tempCell.innerHTML == getSideCell(tempCell, 'up'))) {
                    return;
                } else if (getSideCell(tempCell, 'left') !== undefined && (tempCell.innerHTML == getSideCell(tempCell, 'left').innerHTML)) {
                    return;
                } else if (getSideCell(tempCell, 'down') !== undefined && (tempCell.innerHTML == getSideCell(tempCell, 'down').innerHTML)) {
                    return;
                } else if (getSideCell(tempCell, 'right') !== undefined && (tempCell.innerHTML == getSideCell(tempCell, 'right').innerHTML)) {
                    return;
                };
            }
            // 游戏结束，显示模态框和最终分数
            console.log('game over!');
            model.style.display = 'block';
            var finalScore = document.querySelector('.box span')
            finalScore.innerHTML = parseInt(currentN.innerHTML);

        } else {
            return;
        }
    }


    // 4.6 根据数字刷新颜色
    function refreshColor() {
        var cells = document.getElementsByClassName('cell');
        // console.log(cells);
        for (let i = 0; i < cells.length; i++) {
            // console.log(cells[i]);
            if (cells[i].innerHTML == '' || cells[i].innerHTML == 2) {
                cells[i].style.backgroundColor = '#fff';
            } else if (cells[i].innerHTML == 4) {
                cells[i].style.backgroundColor = 'rgb(202, 240, 240)';
            } else if (cells[i].innerHTML == 8) {
                cells[i].style.backgroundColor = 'rgb(117, 231, 193)';
            } else if (cells[i].innerHTML == 16) {
                cells[i].style.backgroundColor = 'rgb(240, 132, 132)';
            } else if (cells[i].innerHTML == 32) {
                cells[i].style.backgroundColor = 'rgb(181, 240, 181)';
            } else if (cells[i].innerHTML == 64) {
                cells[i].style.backgroundColor = 'rgb(182, 210, 246)';
            } else if (cells[i].innerHTML == 128) {
                cells[i].style.backgroundColor = 'rgb(255, 207, 126)';
            } else if (cells[i].innerHTML == 256) {
                cells[i].style.backgroundColor = 'rgb(250, 216, 216)';
            } else if (cells[i].innerHTML == 512) {
                cells[i].style.backgroundColor = 'rgb(124, 183, 231)';
            } else if (cells[i].innerHTML == 1028) {
                cells[i].style.backgroundColor = 'rgb(225, 219, 215)';
            } else if (cells[i].innerHTML == 2048) {
                cells[i].style.backgroundColor = 'rgb(221, 160, 221)';
            } else if (cells[i].innerHTML == 4096) {
                cells[i].style.backgroundColor = 'rgb(250, 139, 176)';
            } else if (cells[i].innerHTML == 8192) {
                cells[i].style.backgroundColor = 'rgb(255, 215, 000)';
            }
        }
    }

    // 关闭按钮注册事件
    var close = document.querySelector('.close');
    close.addEventListener('click', function () {
        model.style.display = 'none';
    });

    // 再来一次按钮注册事件
    var again = document.querySelector('.again');
    again.addEventListener('click', function () {
        model.style.display = 'none';
        btn[0].click();
    })

})();
