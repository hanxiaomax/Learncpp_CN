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

??? note "关键点速记"


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

We can also use std::move when filling elements of a container, such as std::vector, with l-values.

In the following program, we first add an element to a vector using copy semantics. Then we add an element to the vector using move semantics.

```cpp
#include <iostream>
#include <string>
#include <utility> // for std::move
#include <vector>

int main()
{
	std::vector<std::string> v;

	// We use std::string because it is movable (std::string_view is not)
	std::string str { "Knock" };

	std::cout << "Copying str\n";
	v.push_back(str); // calls l-value version of push_back, which copies str into the array element

	std::cout << "str: " << str << '\n';
	std::cout << "vector: " << v[0] << '\n';

	std::cout << "\nMoving str\n";

	v.push_back(std::move(str)); // calls r-value version of push_back, which moves str into the array element

	std::cout << "str: " << str << '\n'; // The result of this is indeterminate
	std::cout << "vector:" << v[0] << ' ' << v[1] << '\n';

	return 0;
}
```

COPY

On the author’s machine, this program prints:

```
Copying str
str: Knock
vector: Knock

Moving str
str:
vector: Knock Knock
```

In the first case, we passed push_back() an l-value, so it used copy semantics to add an element to the vector. For this reason, the value in str is left alone.

In the second case, we passed push_back() an r-value (actually an l-value converted via std::move), so it used move semantics to add an element to the vector. This is more efficient, as the vector element can steal the string’s value rather than having to copy it.

Moved from objects will be in a valid, but possibly indeterminate state

When we move the value from a temporary object, it doesn’t matter what value the moved-from object is left with, because the temporary object will be destroyed immediately anyway. But what about lvalue objects that we’ve used std::move() on? Because we can continue to access these objects after their values have been moved (e.g. in the example above, we print the value of `str` after it has been moved), it is useful to know what value they are left with.

There are two schools of thought here. One school believes that objects that have been moved from should be reset back to some default / zero state, where the object does not own a resource any more. We see an example of this above, where `str` has been cleared to the empty string.

The other school believes that we should do whatever is most convenient, and not constrain ourselves to having to clear the moved-from object if its not convenient to do so.

So what does the standard library do in this case? About this, the C++ standard says, “Unless otherwise specified, moved-from objects [of types defined in the C++ standard library] shall be placed in a valid but unspecified state.”

In our example above, when the author printed the value of `str` after calling `std::move` on it, it printed an empty string. However, this is not required, and it could have printed any valid string, including an empty string, the original string, or any other valid string. Therefore, we should avoid using the value of a moved-from object, as the results will be implementation-specific.

In some cases, we want to reuse an object whose value has been moved (rather than allocating a new object). For example, in the implementation of myswapMove() above, we first move the resource out of `a`, and then we move another resource into `a`. This is fine because we never use the value of `a`between the time where we move it out and the time where we give `a` a new determinate value.

With a moved-from object, it is safe to call any function that does not depend on the current value of the object. This means we can set or reset the value of the moved-from object (using `operator=`, or any kind of `clear()` or `reset()` member function). We can also test the state of the moved-from object (e.g. using `empty()` to see if the object has a value). However, we should avoid functions like `operator[]` or `front()` (which returns the first element in a container), because these functions depend on the container having elements, and a moved-from container may or may not have elements.

!!! tldr "关键信息"

	`std::move()` gives a hint to the compiler that the programmer doesn’t need the value of an object any more. Only use `std::move()` on persistent objects whose value you want to move, and do not make any assumptions about the value of the object beyond that point. It is okay to give a moved-from object a new value (e.g. using `operator=`) after the current value has been moved.

## Where else is `std::move` useful?

`std::move`can also be useful when sorting an array of elements. Many sorting algorithms (such as selection sort and bubble sort) work by swapping pairs of elements. In previous lessons, we’ve had to resort to copy-semantics to do the swapping. Now we can use move semantics, which is more efficient.

It can also be useful if we want to move the contents managed by one smart pointer to another.

## Conclusion

`std::move` can be used whenever we want to treat an l-value like an r-value for the purpose of invoking move semantics instead of copy semantics.
 