---
title: 11.5 - 多维数组
alias: 11.5 - 多维数组
origin: /multidimensional-arrays/
origin_title: "11.5 — Multidimensional Arrays"
time: 2022-4-8
type: translation
tags:
- array
---

??? note "Key Takeaway"
	- 使用**嵌套大括号**初始化二维数组
	- 带有初始化列表的二维数组只能忽略最左边的长度声明
	

数组的元素可以是任何数据类型，包括数组！数组的数组被称为**多维数组**

```cpp
int array[3][5]; // a 3-element array of 5-element arrays
```


因为数组有两个下标，所以这是一个二维数组。

在二维数组中，可以方便地将第一个(左)下标视为行，而将第二个(右)下标视为列。这被称为**行主序**。上述二维数组的布局如下:

```
[0][0]  [0][1]  [0][2]  [0][3]  [0][4] // row 0
[1][0]  [1][1]  [1][2]  [1][3]  [1][4] // row 1
[2][0]  [2][1]  [2][2]  [2][3]  [2][4] // row 2
```

同时使用两个下标就可以访问二维数组中的元素：

```cpp
array[2][3] = 7;
```


## 初始化二维数组

要初始化一个二维数组，最简单的方法是使用**嵌套大括号**，每组数字代表一行：

```cpp
int array[3][5]
{
  { 1, 2, 3, 4, 5 }, // row 0
  { 6, 7, 8, 9, 10 }, // row 1
  { 11, 12, 13, 14, 15 } // row 2
};
```


尽管有些编译器允许你省略内层大括号，但我们强烈建议您无论如何都包含它们，这既是为了可读性，也是因为C++会用 0 替换缺少的初始化值。

```cpp
int array[3][5]
{
  { 1, 2 }, // row 0 = 1, 2, 0, 0, 0
  { 6, 7, 8 }, // row 1 = 6, 7, 8, 0, 0
  { 11, 12, 13, 14 } // row 2 = 11, 12, 13, 14, 0
};
```

带有初始化列表的二维数组只能忽略最左边的长度声明：

```cpp
int array[][5]
{
  { 1, 2, 3, 4, 5 },
  { 6, 7, 8, 9, 10 },
  { 11, 12, 13, 14, 15 }
};
```

编译器可以计算出数组的长度。但是，下面这样是不允许的：

```cpp
int array[][]
{
  { 1, 2, 3, 4 },
  { 5, 6, 7, 8 }
};
```

就像普通数组一样，多维数组仍然可以初始化为0，如下所示:

```cpp
int array[3][5]{};
```


## 遍历二维数组中的元素

访问二维数组的所有元素需要两个循环：一个用于行，一个用于列。由于二维数组通常是逐行访问的，所以**行索引通常用作外部循环**。

```cpp
for (int row{ 0 }; row < numRows; ++row) // step through the rows in the array
{
    for (int col{ 0 }; col < numCols; ++col) // step through each element in the row
    {
        std::cout << array[row][col];
    }
}
```

在 C++11 中，`for-each` 循环也可以用于多维数组，我们会在[[11-13-For-each-loops|11.11 - for-each 循环]]中进行介绍。

## 超过二维的多维数组

多维数组的维数可以超过2维。下面是一个三维数组的声明：

```cpp
int array[5][4][3];
```

三维数组没办法以符合直觉的方式使用初始化列表来初始化，所以最好将其初始化为0然后再使用嵌套循环显式地初始化。

访问三维数组元素的方法个二维数组是类似的：

```cpp
std::cout << array[3][1][2];
```


## 一个二维数组的例子

让我们来看一个二维数组的实际例子：

```cpp
#include <iostream>

int main()
{
    constexpr int numRows{ 10 };
    constexpr int numCols{ 10 };

    // Declare a 10x10 array
    int product[numRows][numCols]{};

    // Calculate a multiplication table
    for (int row{ 1 }; row < numRows; ++row)
    {
        for (int col{ 1 }; col < numCols; ++col)
        {
            product[row][col] = row * col;
        }
     }

    // Print the table
    for (int row{ 1 }; row < numRows; ++row)
    {
        for (int col{ 1 }; col < numCols; ++col)
        {
            std::cout << product[row][col] << '\t';
        }

        std::cout << '\n';
    }

    return 0;
}
```

这个程序计算并打印1到9(包括9)之间所有值的乘法表。注意，在打印表时，for循环从1开始，而不是从0开始。输出如下:


```
1    2    3    4    5    6    7    8    9
2    4    6    8    10   12   14   16   18
3    6    9    12   15   18   21   24   27
4    8    12   16   20   24   28   32   36
5    10   15   20   25   30   35   40   45
6    12   18   24   30   36   42   48   54
7    14   21   28   35   42   49   56   63
8    16   24   32   40   48   56   64   72
9    18   27   36   45   54   63   72   81
```

二维数组通常用于基于贴图的游戏中，其中每个数组元素代表一个贴图。它们也被用于3d计算机图形(作为矩阵)，以旋转、缩放和表示形状。