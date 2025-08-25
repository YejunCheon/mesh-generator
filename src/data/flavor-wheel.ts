import { FlavorNode } from '../types';

export const flavorWheelData: FlavorNode = {
  name: "Root",
  children: [
    {
      name: "Fruity",
      children: [
        {
          name: "Berry",
          children: [
            { name: "Blackberry" },
            { name: "Raspberry" },
            { name: "Blueberry" },
            { name: "Strawberry" }
          ]
        },
        {
          name: "Dried Fruit",
          children: [
            { name: "Raisin" },
            { name: "Prune" }
          ]
        },
        {
          name: "Other Fruit",
          children: [
            { name: "Coconut" },
            { name: "Cherry" },
            { name: "Pomegranate" },
            { name: "Pineapple" },
            { name: "Grape" },
            { name: "Apple" },
            { name: "Peach" },
            { name: "Pear" }
          ]
        },
        {
          name: "Citrus Fruit",
          children: [
            { name: "Grapefruit" },
            { name: "Orange" },
            { name: "Lemon" },
            { name: "Lime" }
          ]
        }
      ]
    },
    {
      name: "Sour/Fermented",
      children: [
        {
          name: "Sour",
          children: [
            { name: "Sour Aromatics" },
            { name: "Acetic Acid" },
            { name: "Butyric Acid" },
            { name: "Isovaleric Acid" },
            { name: "Citric Acid" },
            { name: "Malic Acid" }
          ]
        },
        {
          name: "Alcohol/Fermented",
          children: [
            { name: "Winey" },
            { name: "Whiskey" },
            { name: "Fermented" },
            { name: "Overripe" }
          ]
        }
      ]
    },
    {
      name: "Green/Vegetative",
      children: [
        {
          name: "Olive Oil",
          children: []
        },
        {
          name: "Raw",
          children: []
        },
        {
          name: "Green/Vegetative",
          children: [
            { name: "Under-ripe" },
            { name: "Peapod" },
            { name: "Fresh" },
            { name: "Dark Green" },
            { name: "Vegetative" },
            { name: "Hay-like" },
            { name: "Herb-like" }
          ]
        },
        {
          name: "Beany",
          children: []
        }
      ]
    },
    {
      name: "Other",
      children: [
        {
          name: "Papery/Musty",
          children: [
            { name: "Stale" },
            { name: "Cardboard" },
            { name: "Papery" },
            { name: "Woody" },
            { name: "Moldy/Damp" },
            { name: "Musty/Dusty" },
            { name: "Musty/Earthy" }
          ]
        },
        {
          name: "Chemical",
          children: [
            { name: "Bitter" },
            { name: "Salty" },
            { name: "Medicinal" },
            { name: "Petroleum" },
            { name: "Skunky" },
            { name: "Rubber" }
          ]
        }
      ]
    },
    {
      name: "Roasted",
      children: [
        {
          name: "Pipe Tobacco",
          children: []
        },
        {
          name: "Tobacco",
          children: []
        },
        {
          name: "Burnt",
          children: [
            { name: "Acrid" },
            { name: "Ashy" },
            { name: "Smoky" },
            { name: "Roasted" }
          ]
        },
        {
          name: "Cereal",
          children: [
            { name: "Malt" },
            { name: "Grain" }
          ]
        }
      ]
    },
    {
      name: "Spices",
      children: [
        {
          name: "Pungent",
          children: []
        },
        {
          name: "Pepper",
          children: []
        },
        {
          name: "Brown Spice",
          children: [
            { name: "Anise" },
            { name: "Nutmeg" },
            { name: "Cinnamon" },
            { name: "Clove" }
          ]
        }
      ]
    },
    {
      name: "Nutty/Cocoa",
      children: [
        {
          name: "Nutty",
          children: [
            { name: "Peanuts" },
            { name: "Hazelnut" },
            { name: "Almond" }
          ]
        },
        {
          name: "Cocoa",
          children: [
            { name: "Chocolate" },
            { name: "Dark Chocolate" }
          ]
        }
      ]
    },
    {
      name: "Sweet",
      children: [
        {
          name: "Brown Sugar",
          children: [
            { name: "Molasses" },
            { name: "Maple Syrup" },
            { name: "Caramelized" },
            { name: "Honey" }
          ]
        },
        {
          name: "Vanilla",
          children: []
        },
        {
          name: "Vanillin",
          children: []
        },
        {
          name: "Overall Sweet",
          children: []
        },
        {
          name: "Sweet Aromatics",
          children: []
        }
      ]
    },
    {
      name: "Floral",
      children: [
        {
          name: "Black Tea",
          children: []
        },
        {
          name: "Floral",
          children: [
            { name: "Jasmine" },
            { name: "Rose" },
            { name: "Chamomile" }
          ]
        }
      ]
    }
  ]
};
