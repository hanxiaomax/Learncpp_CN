---
title: M.x - 小结与测试 - 移动和智能指针
alias: M.x - 小结与测试 - 移动和智能指针
origin: /chapter-m-comprehensive-review/
origin_title: "M.x — Chapter M comprehensive review"
time: 2022-7-23
type: translation
tags:
- summary
---

## 复习

[[M-1-introduction-to-smart-pointers-and-move-semantics|M.1 - 智能指针和移动语义简介]]

- [[smart pointer class|智能指针类]]是一种组合类，用于对动态分配的内存进行管理并确保该内存在智能指针指向的对象[[going-out-of-scope|离开作用域]]后被释放。
- [[copy-semantics|拷贝语义]]允许类被复制，该过程主要通过[[copy-constructor|拷贝构造函数]]和[[copy-assignment-operator|拷贝赋值运算符]]来完成。
- [[move-semantics|移动语义]]指的是类将对象的所有权转译给另外一个对象，而不是创建一个拷贝，该过程主要通过[[move-constructor|移动构造函数]]和 [[move-assignment-operator|移动赋值运算符]]来完成。
- `std::auto_ptr` 已经被弃用，应该避免使用。

[[M-2-R-value-references|M.2 - 右值引用]]

- 一个[[rvalue-reference|右值引用]]引用应该使用一个右值来初始化。 右值引用使用双`&&`号创建。编写将右值引用作为[[parameters|形参]]的函数是可以的，但是绝对不要将右值引用作为返回值。


[[M-3-move-constructors-and-move-assignment|M.3 - 移动构造函数和移动赋值]]

- 当我们构建对象或对对象赋值时，如果参数是[[lvalue|左值]]，则唯一能做的合理操作是拷贝该左值。我们不能假定改变该左值是安全的，因为它可能会在后面的程序中再次被使用。对于表达式 “a = b”，我们没有理由期望b以任何方式被改变。
- 但是，当构建对象或者赋值对象时，如果参数是[[rvalue|右值]]，那么我们可以确定该右值肯定是一个临时对象。与其拷贝（开销大）它，不如直接将它的资源转移（开销小）给被构建或被赋值的对象。这么做是安全的，因为临时对象总是在表达式结束时就被销毁，所以肯定不会再次被使用了。
- 你可以使用 `delete` 关键字禁用拷贝语义（通过删除拷贝构造函数和拷贝赋值运算符）

[[M-4-std-move|M.4 - std::move]]

- `std::move` 允许我们将zu you to treat an l-value as r-value. This is useful when we want to invoke move semantics instead of copy semantics on an l-value.

std::move_if_noexcept will return a movable r-value if the object has a noexcept move constructor, otherwise it will return a copyable l-value. We can use the noexcept specifier in conjunction with std::move_if_noexcept to use move semantics only when a strong exception guarantee exists (and use copy semantics otherwise).

std::unique_ptr is the smart pointer class that you should probably be using. It manages a single non-shareable resource. std::make_unique() (in C++14) should be preferred to create new std::unique_ptr. std::unique_ptr disables copy semantics.

std::shared_ptr is the smart pointer class used when you need multiple objects accessing the same resource. The resource will not be destroyed until the last std::shared_ptr managing it is destroyed. std::make_shared() should be preferred to create new std::shared_ptr. With std::shared_ptr, copy semantics should be used to create additional std::shared_ptr pointing to the same object.

std::weak_ptr is the smart pointer class used when you need one or more objects with the ability to view and access a resource managed by a std::shared_ptr, but unlike std::shared_ptr, std::weak_ptr is not considered when determining whether the resource should be destroyed.