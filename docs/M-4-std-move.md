---
title: M.4 - std::move
alias: M.4 - std::move
origin: /stdmove/
origin_title: "M.4 — std::move"
time: 2022-10-4
type: translation
tags:
- move
---

??? note "Key Takeaway"

	- 只有右值才能触发[[move-semantics|移动语义]]，因此必须是右值（字面量、匿名对象）或者被`std::move()`作用的左值才能够触发
	- 	`std::move()` 会提示编译器，程序员已经不再需要该值了。所以，`std::move()` 应该被应用于那些希望资源被移出的对象，且此后不应当假定该对象还持有该资源。给资源被移出的对象赋新值是可以的。
	


随着你开始频繁地使用移动语义，你会发现有时候在你需要使用它的时候，对象是左值而不是右值导致你无法使用。考虑下面这个`swap`函数的例子：

```cpp
#include <iostream>
#include <string>

template<class T>
void myswapCopy(T& a, T& b)
{
	T tmp { a }; // invokes copy constructor
	a = b; // invokes copy assignment
	b = tmp; // invokes copy assignment
}

int main()
{
	std::string x{ "abc" };
	std::string y{ "de" };

	std::cout << "x: " << x << '\n';
	std::cout << "y: " << y << '\n';

	myswapCopy(x, y);

	std::cout << "x: " << x << '\n';
	std::cout << "y: " << y << '\n';

	return 0;
}
```

传入两个T类型的对象（在这个例子中是`std::string`）给函数，然后将它们的值交换（在这个过程中创建了三个副本）。程序输出结果为：

```
x: abc
y: de
x: de
y: abc
```

这个版本的`swap`函数创建了三个副本， 而创建副本是低效的操作，这其中涉及到了多次字符串的创建和销毁，显然效率是很低的。

实际上，这里并不需要创建拷贝，因为我们执行希望将a和b的值交换，这个操作使用三次移动也可完成啊！所以如果能将拷贝语义替换为移动语义，代码无疑会更高效。

但是应该怎么做呢？这里的问题在于，a和b都是[[lvalue-reference|左值引用]]，而不是[[rvalue-reference|右值引用]]，所以没有办法调用[[move-constructor|移动构造函数]]和[[move-assignment-operator|移动赋值运算符]]。默认情况下，基于左值引用执行的是拷贝构造函数和拷贝赋值操作符。那究竟应该如何实现呢？

## `std::move`

在 C++11 中 标准库提供了`std::move`函数用于将实参转换（使用[[static-casts|静态类型转换]]）为右值引用，以便激活移动操作。因此，我们可以使用 `std::move` 对一个左值类型进行转换，使其能够被移动。`std::move` 定义在utility头文件中。

下面的程序和之前的类似，但是 `myswapMove()` 函数使用`std::move`函数将左值转换成了右值，所以调用了移动语义相关操作：

```cpp
#include <iostream>
#include <string>
#include <utility> // for std::move

template<class T>
void myswapMove(T& a, T& b)
{
	T tmp { std::move(a) }; // invokes move constructor
	a = std::move(b); // invokes move assignment
	b = std::move(tmp); // invokes move assignment
}

int main()
{
	std::string x{ "abc" };
	std::string y{ "de" };

	std::cout << "x: " << x << '\n';
	std::cout << "y: " << y << '\n';

	myswapMove(x, y);

	std::cout << "x: " << x << '\n';
	std::cout << "y: " << y << '\n';

	return 0;
}
```

程序输出：

```
x: abc
y: de
x: de
y: abc
```

程序的输出结果一样，但是效率要高得多。当`tmp`初始化时，它没有创建x副本，这里我们使用 `std::move`将左值x转换成了一个右值。因为参数是右值，所以调用了移动构造函数，x被移动到了`tmp`。

经过几次转换，变量x的值被移动到了y，而y的值也被移动到了x。

## 另外一个例子

我们还可以使用`std::move`来填充容器的元素，例如使用左值填充 `std::vector` 。

在下面的例子中，我们首先使用拷贝语义向`vector`添加元素。然后使用移动语义做同样的操作。

```cpp
#include <iostream>
#include <string>
#include <utility> // for std::move
#include <vector>

int main()
{
	std::vector<std::string> v;

	// 这里使用 std::string 是因为它是可移动的 (std::string_view 不可移动)
	std::string str { "Knock" };

	std::cout << "Copying str\n";
	v.push_back(str); // 调用左值版本的 push_back，它会将str拷贝到数组元素

	std::cout << "str: " << str << '\n';
	std::cout << "vector: " << v[0] << '\n';

	std::cout << "\nMoving str\n";

	v.push_back(std::move(str)); // 调用右值版本的 push_back，它会将str移动到数组元素

	std::cout << "str: " << str << '\n'; // 打印中奖结果
	std::cout << "vector:" << v[0] << ' ' << v[1] << '\n';

	return 0;
}
```

在笔者的机器上会输出如下信息：

```
Copying str
str: Knock
vector: Knock

Moving str
str:
vector: Knock Knock
```

在第一种情况下，传入 `push_back()` 的是一个左值，所以它会使用拷贝语义向`vector`添加元素。因此，原字符串还被保存在`str`中。

对于第二种情况，传入 `push_back()` 的是一个右值（准确来讲是通过`std::move`将左值转换成的右值），所以它会使用移动语义向`vector`添加元素。这个操作无疑是更加高效的，因为`vector`的元素“窃取了”字符串的值，而没有创建它的拷贝。

## 资源被移动的对象处于一种有效，但可能不确定的状态

当我们从一个**临时对象**中把资源移动出来时，这个临时对象中还剩下什么其实并不重要，因为它马上就要被销毁了。但是对于一个**左值对象**来说，当我们对它使用`std::move()`后会怎么样呢？因为该左值在其资源被移动后，仍然可能会被访问（在这个例子中，当我们打印`str`的值时，内容已经没有了），所以有必要知道该对象资源被移动后，还有什么留在原对象中。

关于这个问题的思考有两个派系。一派人任务，资源已经被移动走的对象，应该被重置为某种默认状态或0幢，因为它不再拥有资源。上面的例子很好地展示了这种情况。

另外一派人则认为应该“怎么方便怎么来”，如果清理该对象很麻烦，那就不必清理。

那么，标准库是如何做的呢？关于这个问题，C++标准认为：“除非有明确的规定，否则C++标准库中定义的类型，在资源被移动后应该被置于**任意一种有效**的状态”。

在上面的例子中，当左值打印 `str` 值时，程序输出的空字符串。但是，这并不是一定的，打印任何其他合法的字符串也可以，包括空字符串、原本的字符串或任何合法的字符串。因此，==我们应该避免继续使用已经被移动的左值对象，因为其结果取决于编译器的具体实现。==

在有些场景下，我们需要继续使用已经被移动的对象（而不希望重新分配一个新对象）。例如，在上面 `myswapMove()` 的实现中，我们首先将a的资源移出，然后将其他资源移动到a。这么做可行是因为，a的值被移除到a再次获得一个确定的值的这段时间内，我们不会使用a的值。

==对于一个被移动了资源的对象来说，调用任何不依赖其值的函数是安全的==。也就是说，我们可以设置、重置该对象的值（使用`=`或`clear()`或`reset()`成员函数）。我们可以检查它的状态(例如使用 `empty()` 判断该对象是否有值)。但是，我们必须避免`operator[]` 或 `front()` 这样的函数，因为这些函数依赖于对象中存放的值，而被移动后的对象可能可以，也可能不能够提供这些值。

!!! tldr "关键信息"

	`std::move()` 会提示编译器，程序员已经不再需要该值了。所以，`std::move()` 应该被应用于那些希望资源被移出的对象，且此后不应当假定该对象还持有该资源。给资源被移出的对象赋新值是可以的。
	

## `std::move` 还有什么用途？

`std::move` 在进行数组排序时也很有用。很多排序算法 (例如选择排序和冒泡排序)是基于交换两个元素而实现的。在之前的课程中，我们使用了基于拷贝语义的交换，现在可以将它替换成基于移动语义的交换了，这么做效率会高很多。

此外，当我们需要将某个智能指针管理的内容转移到另一个智能指针时，该函数也很有用。

## 小结

当一个左值需要被当做右值使用，以便触发移动语义时，可以使用`std::move`。
 