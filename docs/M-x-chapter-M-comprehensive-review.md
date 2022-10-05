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

[[smart pointer class|智能指针类]]是一种组合类，用于对动态分配的内存进行管理并确保该内存在智能指针指向的对象[[going-out-of-scope|离开作用域]]后被释放。
 
[[copy-semantics|拷贝语义]]允许类被复制，该过程主要通过[[copy-constructor|拷贝构造函数]]和[[copy-assignment-operator|拷贝赋值运算符]]来完成。

[[move-semantics|移动语义]]指的是类将对象的所有权转译给另外一个对象，而不是创建一个拷贝，该过程主要通过[[move-constructor|移动构造函数]]和 [[move assignment operator|移动赋值运算符]]来完成。

`std::auto_ptr` 已经被弃用，应该避免使用。

一个[[rvalue-reference|右值引用]]引用应该使用一个右值来初始化。 右值引用使用双`&&`号创建。编写将右值引用作为[[parameters|形参]]的函数是可以的，但是绝对不要将右值引用作为返回值。

If we construct an object or do an assignment where the argument is an l-value, the only thing we can reasonably do is copy the l-value. We can’t assume it’s safe to alter the l-value, because it may be used again later in the program. If we have an expression “a = b”, we wouldn’t reasonably expect b to be changed in any way.

However, if we construct an object or do an assignment where the argument is an r-value, then we know that r-value is just a temporary object of some kind. Instead of copying it (which can be expensive), we can simply transfer its resources (which is cheap) to the object we’re constructing or assigning. This is safe to do because the temporary will be destroyed at the end of the expression anyway, so we know it will never be used again!

You can use the delete keyword to disable copy semantics for classes you create by deleting the copy constructor and copy assignment operator.

std::move allows you to treat an l-value as r-value. This is useful when we want to invoke move semantics instead of copy semantics on an l-value.

std::move_if_noexcept will return a movable r-value if the object has a noexcept move constructor, otherwise it will return a copyable l-value. We can use the noexcept specifier in conjunction with std::move_if_noexcept to use move semantics only when a strong exception guarantee exists (and use copy semantics otherwise).

std::unique_ptr is the smart pointer class that you should probably be using. It manages a single non-shareable resource. std::make_unique() (in C++14) should be preferred to create new std::unique_ptr. std::unique_ptr disables copy semantics.

std::shared_ptr is the smart pointer class used when you need multiple objects accessing the same resource. The resource will not be destroyed until the last std::shared_ptr managing it is destroyed. std::make_shared() should be preferred to create new std::shared_ptr. With std::shared_ptr, copy semantics should be used to create additional std::shared_ptr pointing to the same object.

std::weak_ptr is the smart pointer class used when you need one or more objects with the ability to view and access a resource managed by a std::shared_ptr, but unlike std::shared_ptr, std::weak_ptr is not considered when determining whether the resource should be destroyed.