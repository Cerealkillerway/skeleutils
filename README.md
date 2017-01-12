     ___________          .__                 __  .__.__
     /   _____/  | __ ____ |  |   ____  __ ___/  |_|__|  |   ______
     \_____  \|  |/ // __ \|  | _/ __ \|  |  \   __\  |  |  /  ___/
     /        \    <\  ___/|  |_\  ___/|  |  /|  | |  |  |__\___ \
    /_______  /__|_ \\___  >____/\___  >____/ |__| |__|____/____  >
            \/     \/    \/          \/                         \/

#### INTRO
**Skeleutils** package is part of the **Skeletor** project and is not meant be used alone.

Inside a Skeletor app this package provides common utilities, prototypes and general helpers.

### Logger

**skeleUtils.globalUtilities.logger (message, type, force, stackTrace, customSeparator)**: can be used to send console logs, that will be displayed based on the value of the app's debug variable; paramters:
- **message**: *[any] (mandatory)* something to print in the console's log; if it's a string can contain `<separator>` pattern, that will be replaced with a line separator;
- **type**: *[string] (optional)* a string defining the style of the log; it can be extended by adding custom css rules to the *skeleUtils.globalVariables.logTypes* object;
- **force**: *[boolean] (optional)* force the log to be displayed also if app's debug variable is *false* (default to *true*);
- **stackTrace**: *[boolean] (optional)* display the stack trace together with the log (default to *false*);
- **customSeparator**: *[string] (optional)* the separator to be used to replace `<separator>` string in the message; can be a property of the *skeleUtils.globalVariables.logSeparators* object or directly the string to use (default to *skeleUtils.globalVariables.logSeparators.default*);


### Strings

The package extends javascript's *String* with the following methods:

- **ltrim**: left trim;
- **rtrim**: right trim;
- **replaceAll(search, replace)**: replaces all occurrencies in the string;
- - **search**: *[string] (optional)* sub-string to search;
- - **replace**: *[string] (optional)* string to replace to any match;
- **dasherize**: replaces whitespaces with *"-"*;
- **capitalize**: capitalize the string;
- **splitAt(index)**: splits the string at a given index (returns an array);
- - **index**: *[string] (optional)* the index to split at (default to string's *length*);
