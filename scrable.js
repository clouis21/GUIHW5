/*Chad Louis
GUI I HW 5
Contact: chadlouis21@gmail.com
UML
*/
var row_obj = [];
var curr_score = 0;
var curr_word = "";

var DEBUG = false;
var totalLetters = 10;

const NUM_TILES = 10;
function clear_letter_id() {
    for (var i = 0; i < row_obj.length; i++) {
        row_obj[i].letter_id = "";
    }
}
const score_val =
 [
    { "letter": "A", "count": 9, "value": 1 },
    { "letter": "B", "count": 2, "value": 3 },
    { "letter": "C", "count": 2, "value": 3 },
    { "letter": "D", "count": 4, "value": 2 },
    { "letter": "E", "count": 12, "value": 1 },
    { "letter": "F", "count": 2, "value": 4 },
    { "letter": "G", "count": 3, "value": 2 },
    { "letter": "H", "count": 2, "value": 4 },
    { "letter": "I", "count": 9, "value": 1 },
    { "letter": "J", "count": 1, "value": 8 },
    { "letter": "K", "count": 1, "value": 5 },
    { "letter": "L", "count": 4, "value": 1 },
    { "letter": "M", "count": 2, "value": 3 },
    { "letter": "N", "count": 6, "value": 1 },
    { "letter": "O", "count": 8, "value": 1 },
    { "letter": "P", "count": 2, "value": 3 },
    { "letter": "Q", "count": 1, "value": 10 },
    { "letter": "R", "count": 6, "value": 1 },
    { "letter": "S", "count": 4, "value": 1 },
    { "letter": "T", "count": 6, "value": 1 },
    { "letter": "U", "count": 4, "value": 1 },
    { "letter": "V", "count": 2, "value": 4 },
    { "letter": "W", "count": 2, "value": 4 },
    { "letter": "X", "count": 1, "value": 8 },
    { "letter": "Y", "count": 2, "value": 4 },
    { "letter": "Z", "count": 1, "value": 10 },
]


function reset_word() {
    clear_letter_id()

    $(".scrabble-rack").empty();
    document.getElementById('curr-word').innerHTML = "Current Word: ";
    document.getElementById('word-score').innerHTML = "Current Score: 0";

    populated_board_tiles();
    prepare_drop()
}

function print_arr(word) {
    var rval = "";

    for (var i = 0; i < word.length; i++) {
        rval += word[i];
    }

    return rval;
}

function prepare_drop() {
    $(".board-tile").droppable({
        accept: '.tile',
        drop: function(event, ui) {
            var letter = $(ui.draggable).attr('id');
            var element_id = $(this).attr('id');
            var row_index = element_id[0];

            row_obj[row_index].letter_id = letter;
            compute_score();
        },
        out: function(event, ui) {
            var letter = ui.draggable.attr('id');
            var drop_id = $(this).attr('id');
            var row_index = drop_id[0];

            if (letter == row_obj[row_index].letter_id) {
                row_obj[row_index].letter_id = "";
            } else {
                return false;
            }
            compute_score()
        }
    });

    $(".scrabble-rack").droppable({//return letters back to rack
        accept: '.tile',
        drop: function(event, ui){},
        out: function(event, ui){}    
    });

    $(".tile").draggable({
        snap: ".board-tile,.scrabble-rack",
        snapMode: "inner",
        revert: "invalid"
    });
}

function create_board() {//Generate the word board
    var board = document.getElementById('scrabble-board');

    for (var i = 0; i < NUM_TILES; i++) {
        var id;
        var src_file;
        var img = document.createElement('img');

        if (i == 1 || i == 5) {
            src_file = '/double.png'
            id = 'double-word';
        } else {
            src_file = "ScrabbleBoard.jpg";
            id = 'blank';
        }

        img.id = i + '-' + id;
        img.src = src_file;
        img.className = 'board-tile';

        row_obj[i] = {
            'type': id,
            'letter_id': '',
            'img_id': img.id
        }

        board.appendChild(img);
    }
}
function word_len() {
    var length = 0;
    for (var i = 0; i < row_obj.length; i++) {
        if (row_obj[i].letter_id != "") {
            length++;
        }
    }

    return length;
}

function update_word() {//requireing two letters
    var curr_word_length = word_len()
    if (curr_word_length < 2) {
        alert("more than one letter required");
        return false;
    }
    document.getElementById("last-word").innerHTML = "Last Word: " + curr_word;
    document.getElementById("last-score").innerHTML = "Last Score: " + curr_score;
    reset_word()
}
function populated_board_tiles() { //board tle set and randomize
    for (var i = 0; i < NUM_TILES; i++) {
        var rand_index = Math.floor(Math.random() * 26);
        var letter = score_val[rand_index].letter;
        $(".scrabble-rack").append('<img class="tile" id="tile-' + letter + '"src="/Scrabble_Tiles/' + letter + '.jpg">')
    }
}

function compute_score() {
    curr_score = 0;
    curr_word = "";

    for (var i = 0; i < row_obj.length; i++) {
        for (var j = 0; j < score_val.length; j++) {
            var multiplier = 1;

            if (row_obj[i].letter_id != "" && (row_obj[i].letter_id[5] == score_val[j].letter)) {
                curr_word += row_obj[i].letter_id[5];
                if (row_obj[i].type.includes('blank')) {
                    multiplier = 1;
                } else {
                    multiplier = 2;
                }

                curr_score += (score_val[j].value * multiplier);

                document.getElementById('word-score').innerHTML = "Word Score: " + curr_score;
            }
        }
    }

    document.getElementById('curr-word').innerHTML = "Current Word: " + curr_word;

    if (DEBUG) {
        console.log(row_obj);
    }
}



$(document).ready(function () {
    create_board()
    populated_board_tiles()
    prepare_drop()

    $("#reset-word").click(function () {
        reset_word()
    });

    $("#submit-word").click(function () {
        update_word()
    });

});