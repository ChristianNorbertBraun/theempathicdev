---
title: The Issue with Protocol Extensions
author: Christian
date: 2024-06-23
layout: blog
description: Protocol extensions are a great way to simplify the creation of conforming types or enable types to perform actions by simply adding a protocol conformance. However, this convenience comes with its own set of drawbacks. Let's explore why protocol extensions might not always behave as expected and how to effectively resolve these issues.
published: true
---

Protocol extensions are often used to simplify the creation of conforming types or to enable types to perform an action by merely adding a protocol conformance. For instance, an `Alertable` protocol could provide a default implementation for `showAlert(title: String, message: String?)` where `Self: UIViewController`. This way, presenting alerts on a viewcontroller becomes easy by just adding the `Alertable` protocol to the type definition.

Protocol extensions are powerful for reducing code duplication and adding functionality to types with minimal code. However, I recently encountered some behavior that seemed unusual to me.

## The problem

What would you expect the following code to print?

```swift
protocol BaseType {
    func doSomething()
}

extension BaseType {
    func doSomething() {
        print("BaseType")
    }
}

class BaseClass: BaseType {}

class CustomizedClass: BaseClass {
    func doSomething() {
        print("CustomizedClass")
    }
}

let base: BaseType = CustomizedClass()
base.doSomething()
```

My initial expectation was that it would print `"CustomizedClass"`. But the actual output is:

```
"BaseType"
```

While this might only seem like an interesting quirk, it can cause problems in a codebase.

## A more realistic example

Consider a scenario where you are writing a library that provides a service.

```swift
struct Service {
    let errorHandler: CanHandleError
}
```

This `Service` expects a type conforming to `CanHandleError` to handle errors occurring during its execution.

```swift
protocol CanHandleError {
    func handle(_ error: Error)
}

extension CanHandleError {
    func handle(_ error: Error) {
        print("Error: \(error)")
    }
}
```

You provide a default implementation for `handle` to make it easier and faster for types to conform to `CanHandleError`. This default implementation could be sending the error to an analysis backend or raising an error alert to the user.

You might have a class that conforms to `CanHandleError` and provides additional functions for the consumer of your library.

```swift
class DefaultApplicationEngine: CanHandleError {
    // Some more open functions
}
```

This might lead the consumer of your library to believe they can override the `handle(_ error: Error)` method when subclassing `DefaultApplicationEngine`.

```swift
class CustomizedApplicationEngine: DefaultApplicationEngine {
    func handle(_ error: Error) {
        print("Customized Error: \(error)")
    }
}

Service(errorHandler: CustomizedApplicationEngine())
    .errorHandler
    .handle(ApplicationError.wrongConfiguration) // Outputs "Error: ApplicationError.wrongConfiguration"
```

This will cause the code in the protocol extension to be executed instead of the subclass implementation.

## Why is this happening?

To understand why this happens, let's revisit the introductory example.

```swift
protocol BaseType {
    func doSomething()
}

extension BaseType {
    func doSomething() {
        print("BaseType")
    }
}

class BaseClass: BaseType {}

class CustomizedClass: BaseClass {
    func doSomething() {
        print("CustomizedClass")
    }
}

let base: BaseType = CustomizedClass()
base.doSomething()
```

The reason is due to the way method dispatch works in Swift. Protocol extension methods are **statically dispatched**. This means the method implementation used is determined at compile time based on the static type of the variable (`BaseType` in this case), not the dynamic type (`CustomizedClass`).

This behavior has been discussed multiple times already. For example in these forum posts from 2015[[1]](https://forums.swift.org/t/proposal-universal-dynamic-dispatch-for-method-calls/237)[[2]](https://developer.apple.com/forums/thread/11426). For more information on what protocols are capable of, read the [protocols section of the Swift language documentation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/). It’s absolutely worth it.

In our case, we want a dynamically dispatched method call.

## The simple solution

The simplest solution is to remove the default implementation from the protocol and force `BaseClass` to implement the function itself. This way, you will also be required to use the `override` keyword in the `CustomizedClass`.

```swift
class BaseClass: BaseType {
    func doSomething() {
        print("BaseClass")
    }
}

class CustomizedClass: BaseClass {
    override func doSomething() {
        print("CustomizedClass")
    }
}

let base: BaseType = CustomizedClass()
base.doSomething() // Outputs "CustomizedClass"
```

With this small change, we switch from a statically dispatched method call to a dynamically dispatched one. This also ensures that subclasses can override the function properly.

```swift
class CustomizedClass: BaseClass {
    // does not override doSomething
}

class AnotherClass: CustomizedClass {
    override func doSomething() {
        print("AnotherClass")
    }
}

let base: BaseType = AnotherClass()
base.doSomething() // Outputs "AnotherClass"
```

By forcing the conforming types to implement the function, we ensure dynamic dispatch and maintain the expected behavior.

## Is there a better solution?

In my opinion, yes. By leveraging composition instead of inheritance and using structs instead of protocols, you can achieve a more flexible and maintainable design. This approach is also promoted by the brilliant minds at Point-Free. For example, in their video on [Protocol Witnesses](https://www.youtube.com/watch?v=3BVkbWXcFS4) or their [series on designing better dependencies](https://www.pointfree.co/collections/dependencies).

Using composition and structs, along with my own spin on making the API similar to the one defined before, results in the following code:

```swift
// Define the protocol with default implementation
protocol BaseType {
    var behavior: Behavior { get }
}

extension BaseType {
    func doSomething() {
        behavior.onAction()
    }
}

// Struct for holding the behavior
struct Behavior {
    let onAction: () -> Void
}

extension Behavior {
    static let `default` = Behavior {
        print("BaseType")
    }
}

// Class conforming to BaseType and using composition for behavior
class BaseClass: BaseType {
    var behavior: Behavior { .default }
}

class CustomizedClass: BaseClass {
    override var behavior: Behavior {
        Behavior {
            print("CustomizedClass")
        }
    }
}

// Usage
let base: BaseType = BaseClass()
base.doSomething() // Outputs "BaseType"

let customized: BaseType = CustomizedClass()
customized.doSomething() // Outputs "CustomizedClass"
```

Now, any type conforming to `BaseType` is forced to provide a `Behavior`. You might argue that in the original implementation, conforming types did not need to do anything, and this solution might seem worse. However, I want to point out that no matter how many functions are provided by the behavior, the `BaseClass` will always only have to provide a single line to define the behavior and can leverage the full power of the default implementation. Additionally, subclasses of `BaseClass` don’t need to provide a custom behavior, and the behavior can still be customized further down the inheritance tree.

## The suggested approach applied
I see the theory might be a bit hard to grasp, but let's have a final look on the reworked realistic example from ealier.

```swift
struct ErrorHandling {
    let onError: (Error) -> Void
}

extension ErrorHandling {
    static let `default` = ErrorHandling { error in
        print("Error: \(error)")
    }
}

protocol CanHandleError {
    var errorHandling: ErrorHandling { get }
}

extension CanHandleError {
    func handle(_ error: Error) {
        errorHandling.onError(error)
    }
}

class DefaultApplicationEngine: CanHandleError {
    var errorHandling: ErrorHandling { .default }
    // Some more open functions
}

class CustomizedApplicationEngine: DefaultApplicationEngine {
    override var errorHandling: ErrorHandling {
        .init { error in
            print("Custom Error: \(error)")
        }
    }
}

struct Service {
    let errorHandler: CanHandleError
}

Service(errorHandler: CustomizedApplicationEngine())
    .errorHandler
    .handle(ApplicationError.wrongConfiguration)
```

## Conclusion
While protocol extensions provide a powerful tool for reducing code duplication and adding functionality, they come with their own set of challenges, particularly around method dispatch. The solutions discussed here, such as removing default implementations and leveraging composition, offer ways to ensure dynamic behavior and maintainable code. However, these are just ideas that need to prove themselves in real-world applications. This behavior of protocol extensions is not new, but understanding and addressing it can save you from unexpected bugs and design pitfalls.
