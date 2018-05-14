//Dummy data just for development use. Array of JSON-style objects.
var data = [
  {label: "0"},
  {label: "1"},
  {label: "2"},
  {label: "3"},
  {label: "4"},
  {label: "5"},
  {label: "6"},
  {label: "7"},
  {label: "8"},
  {label: "9"},
  {label: "10"},
  {label: "11"},
  {label: "12"},
  {label: "13"},
  {label: "14"},
  {label: "15"},
  {label: "16"},
  {label: "17"},
  {label: "18"},
  {label: "19"},
  {label: "20"},
  {label: "21"},
  {label: "22"},
  {label: "23"},
  {label: "24"},
  {label: "25"},
  {label: "26"},
  {label: "27"},
  {label: "28"},
  {label: "29"},
  {label: "30"},
  {label: "31"},
  {label: "32"},
  {label: "33"},
  {label: "34"},
  {label: "35"},
  {label: "36"},
  {label: "37"},
  {label: "38"},
  {label: "39"},
  {label: "40"},
  {label: "41"},
  {label: "42"},
  {label: "43"},
  {label: "44"},
  {label: "45"},
  {label: "46"},
  {label: "47"},
  {label: "48"},
  {label: "49"},
  {label: "50"},
  {label: "51"},
  {label: "52"},
  {label: "53"},
  {label: "54"},
  {label: "55"},
  {label: "56"},
  {label: "57"},
  {label: "58"},
  {label: "59"},
  {label: "60"},
  {label: "61"},
  {label: "62"},
  {label: "63"},
  {label: "64"},
  {label: "65"},
  {label: "66"},
  {label: "67"},
  {label: "68"},
  {label: "69"},
  {label: "70"},
  {label: "71"},
  {label: "72"},
  {label: "73"},
  {label: "74"},
  {label: "75"},
  {label: "76"},
  {label: "77"},
  {label: "78"},
  {label: "79"},
  {label: "80"},
];
var edges = [
  {source: "1", target: "2", distance: 30},
  {source: "1", target: "3", distance: 30},
  {source: "1", target: "4", distance: 20},
  {source: "1", target: "5", distance: 20},
  {source: "1", target: "6", distance: 10},
  {source: "2", target: "31", distance: 50},
  {source: "2", target: "16", distance: 50},
  {source: "3", target: "2", distance: 30},
  {source: "3", target: "9", distance: 60},
  {source: "4", target: "25", distance: 30},
  {source: "5", target: "27", distance: 30},
  {source: "6", target: "30", distance: 60},
  {source: "15", target: "2", distance: 60},
  {source: "16", target: "1", distance: 50},
  {source: "16", target: "32", distance: 50},
  {source: "16", target: "39", distance: 40},
  {source: "16", target: "38", distance: 40},
  {source: "18", target: "2", distance: 20},
  {source: "21", target: "39", distance: 20},
  {source: "31", target: "38", distance: 30},
  {source: "31", target: "1", distance: 30},
  {source: "31", target: "10", distance: 30},
  {source: "31", target: "3", distance: 40},
  {source: "31", target: "4", distance: 30},
  {source: "31", target: "5", distance: 30},
  {source: "31", target: "6", distance: 30},
  {source: "31", target: "7", distance: 30},
  {source: "31", target: "8", distance: 30},
  {source: "31", target: "9", distance: 30},
  {source: "31", target: "11", distance: 30},
  {source: "14", target: "12", distance: 30},
  {source: "14", target: "13", distance: 30},
  {source: "14", target: "14", distance: 30},
  {source: "14", target: "15", distance: 30},
  {source: "14", target: "16", distance: 50},
  {source: "8", target: "17", distance: 40},
  {source: "8", target: "18", distance: 40},
  {source: "8", target: "19", distance: 50},
  {source: "8", target: "20", distance: 40},
  {source: "8", target: "21", distance: 30},
  {source: "8", target: "22", distance: 40},
  {source: "36", target: "23", distance: 50},
  {source: "36", target: "24", distance: 30},
  {source: "36", target: "25", distance: 30},
  {source: "36", target: "26", distance: 30},
  {source: "36", target: "27", distance: 30},
  {source: "36", target: "28", distance: 30},
  {source: "23", target: "29", distance: 20},
  {source: "23", target: "30", distance: 20},
  {source: "23", target: "32", distance: 20},
  {source: "23", target: "33", distance: 20},
  {source: "23", target: "34", distance: 40},
  {source: "23", target: "35", distance: 40},
  {source: "34", target: "36", distance: 60},
  {source: "34", target: "37", distance: 60},
  {source: "34", target: "38", distance: 40},
  {source: "34", target: "39", distance: 30},
  {source: "40", target: "41", distance: 30},
  {source: "41", target: "42", distance: 30},
  {source: "42", target: "43", distance: 30},
  {source: "43", target: "44", distance: 30},
  {source: "45", target: "46", distance: 30},
  {source: "43", target: "46", distance: 30},
  {source: "46", target: "47", distance: 30},
  {source: "69", target: "50", distance: 10},
  {source: "69", target: "51", distance: 10},
  {source: "69", target: "49", distance: 10},
  {source: "49", target: "50", distance: 15},
  {source: "49", target: "48", distance: 30},
  {source: "50", target: "51", distance: 15},
  {source: "50", target: "55", distance: 30},
  {source: "51", target: "49", distance: 15},
  {source: "51", target: "56", distance: 30},
  {source: "49", target: "52", distance: 30},
  {source: "50", target: "53", distance: 30},
  {source: "51", target: "54", distance: 30},
  {source: "48", target: "52", distance: 30},
  {source: "54", target: "56", distance: 30},
  {source: "55", target: "53", distance: 30},
  {source: "48", target: "56", distance: 30},
  {source: "52", target: "55", distance: 30},
  {source: "53", target: "54", distance: 30},
  {source: "48", target: "57", distance: 30},
  {source: "48", target: "58", distance: 30},
  {source: "57", target: "58", distance: 30},
  {source: "58", target: "59", distance: 30},
  {source: "52", target: "59", distance: 30},
  {source: "52", target: "60", distance: 30},
  {source: "59", target: "60", distance: 30},
  {source: "60", target: "61", distance: 30},
  {source: "55", target: "61", distance: 30},
  {source: "55", target: "62", distance: 30},
  {source: "61", target: "62", distance: 30},
  {source: "62", target: "63", distance: 30},
  {source: "53", target: "63", distance: 30},
  {source: "53", target: "64", distance: 30},
  {source: "63", target: "64", distance: 30},
  {source: "64", target: "65", distance: 30},
  {source: "54", target: "65", distance: 30},
  {source: "54", target: "66", distance: 30},
  {source: "65", target: "66", distance: 30},
  {source: "66", target: "67", distance: 30},
  {source: "56", target: "67", distance: 30},
  {source: "56", target: "68", distance: 30},
  {source: "67", target: "68", distance: 30},
  {source: "57", target: "68", distance: 30},
  {source: "70", target: "71", distance: 20},
  {source: "70", target: "72", distance: 10},
  {source: "71", target: "72", distance: 50},
  {source: "71", target: "73", distance: 110},
  {source: "71", target: "74", distance: 30},
  {source: "74", target: "72", distance: 10},
  {source: "72", target: "75", distance: 150},
  {source: "74", target: "72", distance: 10},
  {source: "74", target: "75", distance: 40},
  {source: "73", target: "74", distance: 20},
  {source: "74", target: "76", distance: 50},
  {source: "75", target: "76", distance: 10},
  {source: "76", target: "73", distance: 10}
]
