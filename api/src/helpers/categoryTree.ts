type CategoryTree = Array<{category: string, subCategories: string[]}>

export var categoryTree: CategoryTree = [
    {
        category: "Adults",
        subCategories: [
            "Ambassadors",
            "Bereans",
            "Crosswords",
            "Faith Builders",
            "Men’s Ministry",
            "Omega",
            "One28",
            "Sojourners",
            "Women’s Ministry"
        ]
    },
    {
        category: "Students",
        subCategories: [
            "Youth",
            "College"
        ]
    },
    {
        category: "Family",
        subCategories: [
            "Children’s Ministry",
            "Foundations",
            "Hearts of Hope"
        ]
    },
    {
        category: "Baptisms",
        subCategories: []
    },
    {
        category: "Special Services",
        subCategories: []
    },
    {
        category: "Conferences",
        subCategories: []
    },
    {
        category: "Seminars",
        subCategories: []
    }
]