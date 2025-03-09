---
title: 11.15 — 指向指针的指针和多维数组
alias: 11.15 — 指向指针的指针和多维数组
origin: /pointers-to-pointers/
origin_title: "11.15 — Pointers to pointers and dynamic multidimensional arrays"
time: 2022-10-15
type: translation
tags:
- pointer
---

> [!note] "Key Takeaway"
	


本课程是可选的，适用于想要了解更多C++知识的高级读者。未来的课程并不会建立在这节课上。

指向指针的指针正是你所期望的那样：它是保存另一个指针地址的指针。

## 指向指针的指针

指向int型的普通指针使用单个星号来声明：

```cpp
int* ptr; // pointer to an int, one asterisk
```

指向指针的指针使用两个星号来声明：

```cpp
int** ptrptr; // pointer to a pointer to an int, two asterisks
```

一个指向int型的普通指针使用一个星号声明：指向指针的指针和普通指针的工作方式一样——你可以解引用它来检索指向的值。因为该值本身是一个指针，所以可以再次解除引用以获得底层值。这些解引用可以连续执行:

```cpp
int value { 5 };

int* ptr { &value };
std::cout << *ptr << '\n'; // Dereference pointer to int to get int value

int** ptrptr { &ptr };
std::cout << **ptrptr << '\n'; // dereference to get pointer to int, dereference again to get int value
```

上述程序打印：

```
5
5
```

注意：指针的指针不能直接设置为一个值：

```cpp
int value { 5 };
int** ptrptr { &&value }; // not valid
```

这是因为取地址操作符需要一个[[lvalue|左值]]作为操作数，但是`&value`是一个[[rvalue|右值]]。

但是，它可以被设置为空指针：

```cpp
int** ptrptr { nullptr };
```

## 指针数组

指向指针的指针有一些用途。最常见的用法是动态分配指针数组：

```cpp
int** array { new int*[10] }; // allocate an array of 10 int pointers
```

上述代码和一般的动态数组行为一致，只不过数组元素是“整型指针”而不是整型罢了。

## 二维动态数组

指向指针的指针的另外一个常见用途是分配多维数组(参见 [[11-5-Multidimensional-Arrays|11.5 - 多维数组]] )。

二维固定数组的声明非常简单：

```cpp
int array[10][5];
```

但是动态数组却稍微有些复杂。你可能会尝试这样做：

```cpp
int** array { new int[10][5] }; // won’t work!
```

但这样做是错误的。

右两种方式可以实现，如果列是固定的，你可以这样做：

```cpp
int x { 7 }; // non-constant
int (*array)[5] { new int[x][5] }; // rightmost dimension must be constexpr
```

为确保正确的优先级，这里的括号是必须的。这里特别适合使用[[type deduction|类型推断]]：

```cpp
int x { 7 }; // non-constant
auto array { new int[x][5] }; // so much simpler!
```

不幸的是，如果最右边的数组维度不是编译时常量，这个相对简单的解决方案就不起作用。在这种情况下，操作就更复杂了。首先，我们分配一个指针数组(如上所述)。然后遍历指针数组，并为每个数组元素分配一个动态数组。我们的动态二维数组是动态一维数组的动态一维数组!

```cpp
int** array { new int*[10] }; // allocate an array of 10 int pointers — these are our rows
for (int count { 0 }; count < 10; ++count)
    array[count] = new int[5]; // these are our columns
```

访问数组的方式和平常一样：

```cpp
array[9][4] = 3; // This is the same as (array[9])[4] = 3;
```

使用这种方法，由于每个数组列都是独立动态分配的，因此可以动态分配非矩形的二维数组。例如，我们可以创建一个三角形数组：

```cpp
int** array { new int*[10] }; // allocate an array of 10 int pointers — these are our rows
for (int count { 0 }; count < 10; ++count)
    array[count] = new int[count+1]; // these are our columns
```

COPY

In the above example, note that `array[0]` is an array of length 1, `array[1]` is an array of length 2, etc…

Deallocating a dynamically allocated two-dimensional array using this method requires a loop as well:

```cpp
for (int count { 0 }; count < 10; ++count)
    delete[] array[count];
delete[] array; // this needs to be done last
```

COPY

Note that we delete the array in the opposite order that we created it (elements first, then the array itself). If we delete array before the array columns, then we’d have to access deallocated memory to delete the array columns. And that would result in undefined behavior.

Because allocating and deallocating two-dimensional arrays is complex and easy to mess up, it’s often easier to “flatten” a two-dimensional array (of size x by y) into a one-dimensional array of size `x * y`:

```cpp
// Instead of this:
int** array { new int*[10] }; // allocate an array of 10 int pointers — these are our rows
for (int count { 0 }; count < 10; ++count)
    array[count] = new int[5]; // these are our columns

// Do this
int *array { new int[50] }; // a 10x5 array flattened into a single array
```

COPY

Simple math can then be used to convert a row and column index for a rectangular two-dimensional array into a single index for a one-dimensional array:

```cpp
int getSingleIndex(int row, int col, int numberOfColumnsInArray)
{
     return (row * numberOfColumnsInArray) + col;
}

// set array[9,4] to 3 using our flattened array
array[getSingleIndex(9, 4, 5)] = 3;
```

COPY

## 通过地址传递指针

就像我们可以使用指针形参来更改传入的底层参数的实际值一样，我们可以将一个指针传递给一个指向函数的指针，然后使用该指针来更改它所指向的指针的值(还不明白吗?)

However, if we want a function to be able to modify what a pointer argument points to, this is generally better done using a reference to a pointer instead. This is covered in lesson [[9-10-Pass-by-address-part-2|9.10 - 按地址传递 Part2]]

## 指针的指针的指针

声明指向指针的指针的指针也是可以的：

```cpp
int*** ptrx3;
```

这样可以动态分配一个三维数组。然而，这样做将需要一个循环中的循环，并且要得到正确的结果是极其复杂的。

你甚至可以声明一个四重指针：

```cpp
int**** ptrx4;
```

只要你愿意，更高层的指针也是可以的。

但是，现实中并不会出现这样的定义，因为我们不会使用这么多层次的间接关系。

## 小结

我们建议避免使用指向指针的指针，除非没有其他可用的选项，因为它们使用起来很复杂，而且有潜在的危险。用普通指针解除对空指针或悬浮指针的引用非常简单——使用指向指针的指针更加容易，因为必须执行双重解除引用才能得到底层值！

