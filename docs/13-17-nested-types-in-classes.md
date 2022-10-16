---
title: 13.17 - 类中的嵌套类型
alias: 13.17 - 类中的嵌套类型
origin: /nested-types-in-classes/
origin_title: "13.17 — Nested types in classes"
time: 2022-9-16
type: translation
tags:
- class
- friend
---


考虑下面这个简短的程序：

```cpp
#include <iostream>

enum class FruitType
{
	apple,
	banana,
	cherry
};

class Fruit
{
private:
	FruitType m_type {};
	int m_percentageEaten { 0 };

public:
	Fruit(FruitType type) :
		m_type { type }
	{
	}

	FruitType getType() const { return m_type; }
	int getPercentageEaten() const { return m_percentageEaten; }
};

int main()
{
	Fruit apple { FruitType::apple };

	if (apple.getType() == FruitType::apple)
		std::cout << "I am an apple";
	else
		std::cout << "I am not an apple";

	return 0;
}
```


这个程序并没有任何问题。但是因为[[scoped-enumerations|限定作用域枚举]]（枚举类） `FruitType` 只会在 `Fruit` 类中使用，所以将它定义在类外作为一个独立的枚举类多少有些不妥。


## 嵌套类型

数据和函数可以称为类的成员，在C++中，类型也可以被嵌套地定义在类内。为此，你只需要将类型定义在内合适的[[access-specifiers|成员访问修饰符]]下方即可。

下面的程序类似于之前的例子，只不过枚举被定义在了类内（此处使用了[[unscoped-enumerations|非限定作用域枚举类型]]）。

```cpp
#include <iostream>

class Fruit
{
public:
	// 注意：FruitType 被移动到了类中，位于pubic部分
	// 同时我们将枚举类变成了枚举
	enum FruitType
	{
		apple,
		banana,
		cherry
	};

private:
	FruitType m_type {};
	int m_percentageEaten { 0 };

public:
	Fruit(FruitType type) :
		m_type { type }
	{
	}

	FruitType getType() const { return m_type; }
	int getPercentageEaten() const { return m_percentageEaten; }
};

int main()
{
	// 注意，我们此处是通过 Fruit 来访问 FruitType
	Fruit apple { Fruit::apple };

	if (apple.getType() == Fruit::apple)
		std::cout << "I am an apple";
	else
		std::cout << "I am not an apple";

	return 0;
}
```


首先，`FruitType` 的定义现在位于类内。其次，我们将其定义为public，以便能够从类的外部访问它。

此时的类名实际上充当着所有嵌套类型的[[namespace|命名空间]]，和么枚举类有些类似。在之前的例子中，因为我们使用了枚举类，所以在使用枚举时必须添加 `FruitType:: ` 作用域限定符。在这个例子中，因为`FruitType` 是一个普通的枚举，但是它作为该类的一部分，在访问时也必须添加 `FruitType:: ` 作用域限定符。

注意，因为枚举类也可以充当命名空间，所以如果在上面的例子中使用枚举类而不是枚举，则在访问时必须添加 `Fruit::FruitType::` 作用域限定符。这实在是没有以，所以我们选择使用普通枚举。

## 其他可嵌套类型

虽然枚举可能是最常被嵌套在类中的类型，但C++允许你在类中定义其他类型，例如类型定义、类型别名，甚至其他类!

与类的任何普通成员一样，嵌套类对外围类的成员具有与外围类相同的访问权限。然而，嵌套类对外围类的“this”指针没有任何特殊的访问权限。

嵌套类型的另一个限制是它们不能被[[向前声明]]。然而，在实践中这很少会带来问题，因为整个类定义(包括嵌套类型)通常可以在需要的地方使用被“`#include`”。

定义嵌套类并不常见，但C++标准库在某些情况下确实会这样做，比如迭代器类。

