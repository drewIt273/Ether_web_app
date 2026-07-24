/**
 * Instance by DrewIt
 */

function fb() {
    return jsx('div', {
        class: 'd-flex justify-center h-full',
        append: [
            jsx('div', {
                class: 'items-center gap-xl h-full',
                append: [
                    jsx('div', {
                        append: [
                            jsx('div', {class: 'app-vector', append: [vector.app.cards]}),
                            jsx('span', {style: {maxWidth: '25em', paddingBottom: '1em'}, append: ["An Issue is a task, bug report, or feature request that needs attention or tracking within your project. Issues help your team organize work, prioritize tasks, and maintain a record of problems encountered or improvements desired. Each issue can be documented with details, assigned to team members, and tracked to completion."]}),
                            jsx('div', {class: 'primary-tab', append: ["Create an Issue"]}),
                        ],
                        class: 'd-flex flex-column gap-lg'
                    })
                ]
            })
        ]
    })
}

function Issues$() {
    return jsx('div', {
        class: 'h-full',
        append: [fb()]
    })
}

export {Issues$}