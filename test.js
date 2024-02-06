var type = "normal";
var disabled = false;
const maxWeightBarValue = 28.2

window.addEventListener("message", function(event) {
    const _0x459a2b = $('#weightBar'),
    _0x22c748 = $('#weight'),
    _0x281997 = $('#weightCoffre'),
    _0x117df1 = $('#weightBarCoffre')
    if (event.data.action == "display") {
        type = event.data.type
        disabled = false;

        if (type === "normal") { $(".info-div").hide(); } else if (type === "trunk") { $(".info-div").show(); } else if (type === "property") { $(".info-div").hide(); } else if (type === "vault") { $(".info-div").hide(); } else if (type === "player") { $(".info-div").show(); }

        $(".ui").fadeIn(100);
    } else if (event.data.action == "hide") {
        $("#dialog").dialog("close");
        $(".ui").fadeOut(100);
        $(".item").remove();
        $("#InventaireAutres").html("<div id=\"PasDeuxInvenaitre\"></div>");
        $("#PasDeuxInvenaitre").html(invLocale.secondInventoryNotAvailable);
    } else if (event.data.action == "Inv:WeightBarText") {
        let _0x27a5b7 =
        (maxWeightBarValue * event.data.weight2) / event.data.maxWeight2
      _0x459a2b.css('width', _0x27a5b7 + 'vw')
      _0x22c748.text(event.data.text)
    } else if (event.data.action == "setItems") {
        InventaireON(event.data.itemList, event.data.fastItems, event.data.crMenu);
        maxWeight = event.data.maxWeight2
        totalWeight = event.data.weight2
        let _0x358984 = (maxWeightBarValue / maxWeight) * totalWeight
        _0x459a2b.css('width', _0x358984 + 'vw')
        _0x22c748.text(event.data.text)
        $(".info-div2").html(event.data.text);
        $('.item').draggable({
            helper: 'clone',
            appendTo: 'body',
            zIndex: 99999,
            revert: 'invalid',
            start: function(event, ui) {
                if (disabled) {
                    return false;
                }

                $(this).css('background-image', 'none');
                itemData = $(this).data("item");

                $("#drop").addClass("disabled");
                $("#give").addClass("disabled");
                $("#rename").addClass("disabled");
                $("#use").addClass("disabled");
            },
            stop: function() {
                itemData = $(this).data("item");

                if (itemData !== undefined && itemData.name !== undefined) {
                    $(this).css('background-image', 'url(\'https://fshop.zk-web.fr/inventory/' + itemData.name + '.png\'');
                    $("#drop").removeClass("disabled");
                    $("#use").removeClass("disabled");

                    $("#rename").removeClass("disabled");
                    $("#give").removeClass("disabled");
                }
            }
        });
    } else if (event.data.action == "InventaireON2") {
        secondInventaireON(event.data.itemList);
    } else if (event.data.action == "setShopInventoryItems") {
        shopInventaireON(event.data.itemList)
    } else if (event.data.action == "InventaireAddTest") {
        $(".info-div").html(event.data.text);
    } else if (event.data.action == "InventaireAddTestPoid") {
        $(".weighttrunk-div").html(event.data.text);
    } else if (event.data.action == "InventaireAutres") {
        $("#InventaireAutres").html("");

        $.each(event.data.players, function(index, player) {
            $("#InventaireAutres").append('<button class="JoueurButonautres" data-player="' + player.player + '">' + player.label + ' (' + player.player + ')</button>');
        });
        $("#dialog").dialog("open");

        $(".JoueurButonautres").click(function() {
            $("#dialog").dialog("close");
            player = $(this).data("player");
            $.post("https://invui/GiveItem", JSON.stringify({
                player: player,
                item: event.data.item,
                number: parseInt($("#count").val())
            }));
        });
    }
});

function InventaireON(items, fastItems, crMenu, image) {
    $("#InventaireJ").html("");
    $.each(items, function(index, item) {

        count = setCount(item);

        $("#InventaireJ").append('<div class="slot"><div id="item-' + index + '" class="item" style = "background-image: url(\'https://fshop.zk-web.fr/inventory/' + item.name + '.png\')">' + '<div class="item-count">' + count +'</div> <div class="item-name">' + item.label + '</div> </div ><div class="item-name-bg"></div></div>');

        $('#item-' + index).data('item', item);
        $('#item-' + index).data('inventory', "main");
    });

    $("#InventaireJFastItems").html("");
    if (crMenu == 'item') {
        $("#drop");
        var i;
        for (i = 1; i < 6; i++) {
            $("#InventaireJFastItems").append('<div class="slotFast"><div id="SlotsFAST-' + i + '" class="item" style = "background-image: url(\'https://cdn.discordapp.com/attachments/1182066478741205082/1204414452250841108/image_2023-07-24_181738854-removebg-preview.png\')">' + '<div class="keybind">' + i + '</div><div class="item-count"></div> <div class="item-name"></div> </div ><div class="item-name-bg"></div></div>');
        }
        $.each(fastItems, function(index, item) {
            count = setCount(item);
            $('#SlotsFAST-' + item.slot).css("background-image", 'url(\'https://fshop.zk-web.fr/inventory/' + item.name + '.png\')');
            $('#SlotsFAST-' + item.slot).html('<div class="keybind">' + item.slot + '</div><div class="item-count">' + '</div> <div class="item-name">' + item.label + '</div> <div class="item-name-bg"></div>');
            $('#SlotsFAST-' + item.slot).data('item', item);
            $('#SlotsFAST-' + item.slot).data('inventory', "fast");
        });
    }

    if (crMenu == 'clothe') {
        $("#drop");
    }
    makeDraggables()
    if (crMenu == 'item') {
        $("#drop");
    }
}

function makeDraggables() {
    $('#SlotsFAST-1').droppable({
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            itemInventory = ui.draggable.data("inventory");

            if (type === "normal" && (itemInventory === "main" || itemInventory === "fast")) {
                disableInventory(500);
                $.post("https://invui/PutIntoFast", JSON.stringify({
                    item: itemData,
                    slot: 1
                }));
            }
        }
    });
    $('#SlotsFAST-2').droppable({
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            itemInventory = ui.draggable.data("inventory");

            if (type === "normal" && (itemInventory === "main" || itemInventory === "fast")) {
                disableInventory(500);
                $.post("https://invui/PutIntoFast", JSON.stringify({
                    item: itemData,
                    slot: 2
                }));
            }
        }
    });
    $('#SlotsFAST-3').droppable({
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            itemInventory = ui.draggable.data("inventory");

            if (type === "normal" && (itemInventory === "main" || itemInventory === "fast")) {
                disableInventory(500);
                $.post("https://invui/PutIntoFast", JSON.stringify({
                    item: itemData,
                    slot: 3
                }));
            }
        }
    });
    $('#SlotsFAST-4').droppable({
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            itemInventory = ui.draggable.data("inventory");

            if (type === "normal" && (itemInventory === "main" || itemInventory === "fast")) {
                disableInventory(500);
                $.post("https://invui/PutIntoFast", JSON.stringify({
                    item: itemData,
                    slot: 4
                }));
            }
        }
    });
    $('#SlotsFAST-5').droppable({
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            itemInventory = ui.draggable.data("inventory");

            if (type === "normal" && (itemInventory === "main" || itemInventory === "fast")) {
                disableInventory(500);
                $.post("https://invui/PutIntoFast", JSON.stringify({
                    item: itemData,
                    slot: 5
                }));
            }
        }
    });
}

function secondInventaireON(items) {
    $("#InventaireAutres").html("");
    $.each(items, function(index, item) {
        count = setCount(item);

        $("#InventaireAutres").append('<div class="slot"><div id="itemOther-' + index + '" class="item" style = "background-image: url(\'https://fshop.zk-web.fr/inventory/' + item.name + '.png\')">' +
            '<div class="item-count">' + count + '</div> <div class="item-name">' + item.label + '</div> </div ><div class="item-name-bg"></div></div>');
        $('#itemOther-' + index).data('item', item);
        $('#itemOther-' + index).data('inventory', "second");
    });
}

function shopInventaireON(items) {
    $("#InventaireAutres").html("");
    $.each(items, function(index, item) {
        //count = setCount(item)
        cost = setCost(item);
        $("#InventaireAutres").append('<div class="slot"><div id="itemOther-' + index + '" class="item" style = "background-image: url(\'https://fshop.zk-web.fr/inventory/' + item.name + '.png\')">' +
            '<div class="item-count">' + cost + '</div> <div class="item-name">' + item.label + '</div> </div ><div class="item-name-bg"></div></div>');
        $('#itemOther-' + index).data('item', item);
        $('#itemOther-' + index).data('inventory', "second");
    });
}

$(function() {

    $(".raccours1").click(function() {
        $(".ui").fadeIn();

        $.post("https://invui/OngletInventory", JSON.stringify({
            type: 'item'
        }));
    })

    $(".raccours3").click(function() {
        $(".ui").fadeIn();

        $.post("https://invui/OngletInventory", JSON.stringify({
            type: 'item'
        }));
    })

    $(".raccours2").click(function() {
        $(".ui").fadeIn();

        $.post("https://invui/OngletInventory", JSON.stringify({
            type: 'clothe'
        }));
    })
})

function disableInventory(ms) {
    disabled = true;

    setInterval(function() {
        disabled = false;
    }, ms);
}

function setCount(item) {
    count = item.count

    if (item.limit > 0) {
        count = item.count
    }

    if (item.type === "item_weapon") {
        if (count == 0) {
            count = "";
        } else {
            count = '<img src="img/bullet.png" class="ammoIcon"> ' + item.count;
        }
    }

    if (item.type === "item_account" || item.type === "item_money") {
        count = formatMoney(item.count);
    }

    return count;
}

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
};

$(document).mousedown(function(event) {

    if (event.which != 3) return

    itemData = $(event.target).data("item");

    if (itemData == undefined || itemData.usable == undefined) {
        return;
    }

    itemInventory = $(event.target).data("inventory");

    if (itemData.usable) {

        $(event.target).fadeIn(50)
        setTimeout(function() {
            $.post("https://invui/UseItem", JSON.stringify({
                item: itemData
            }));
        }, 100);
        $(event.target).fadeOut(50)
    }

});

$(document).ready(function() {
    $("#count").focus(function() {
        $(this).val("")
    }).blur(function() {
        if ($(this).val() == "") {
            $(this).val("1")
        }
    });

    $('#use').droppable({
        hoverClass: 'hoverControl',
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            if (itemData.usable) {
                $.post("https://invui/UseItem", JSON.stringify({
                    item: itemData
                }));
            }
        }
    });
    $('.cloth-items .item-box').off().click(function(){
        $.post("https://invui/ChangeComponent",JSON.stringify({component:$(this).attr('id')}))
    })
    $('.cloth-items2 .item-box2').off().click(function(){
        $.post("https://invui/ChangeComponent",JSON.stringify({component:$(this).attr('id')}))
    })

    $('.buttoniconidcard .raccours4').off().click(function(){
        $.post("https://invui/IdCardShow",JSON.stringify())
    })

    $('#give').droppable({
        hoverClass: 'hoverControl',
        drop: function(event, ui) {
            player = $(this).data("player");
            itemData = ui.draggable.data("item");
            $.post("https://invui/GetInventaireAutres", JSON.stringify({
                player: player,
                item: itemData,
                number: parseInt($("#count").val())
            }));
        }
    });

    $('#drop').droppable({
        hoverClass: 'hoverControl',
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            $.post("https://invui/DropItem", JSON.stringify({
                item: itemData,
                number: parseInt($("#count").val())
            }));
        }
    });

    $('#rename').droppable({
        hoverClass: 'hoverControl',
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            $.post("https://invui/RenameCloth", JSON.stringify({
                item: itemData
            }));
        }
    });

    $('#InventaireJ').droppable({
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            itemInventory = ui.draggable.data("inventory");

            if (type === "trunk" && itemInventory === "second") {
                disableInventory(500);
                $.post("https://invui/TakeFromTrunk", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            } else if (type === "property" && itemInventory === "second") {
                disableInventory(500);
                $.post("https://invui/TakeFromProperty", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            } else if (type === "normal" && itemInventory === "fast") {
                disableInventory(500);
                $.post("https://invui/TakeFromFast", JSON.stringify({
                    item: itemData
                }));
            } else if (type === "vault" && itemInventory === "second") {
                disableInventory(500);
                $.post("https://invui/TakeFromVault", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            } else if (type === "player" && itemInventory === "second") {
                disableInventory(500);
                $.post("https://invui/TakeFromPlayer", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            }
        }
    });

    $('#InventaireAutres').droppable({
        drop: function(event, ui) {
            itemData = ui.draggable.data("item");
            itemInventory = ui.draggable.data("inventory");

            if (type === "trunk" && itemInventory === "main") {
                disableInventory(500);
                $.post("https://invui/PutIntoTrunk", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            } else if (type === "property" && itemInventory === "main") {
                disableInventory(500);
                $.post("https://invui/PutIntoProperty", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            } else if (type === "vault" && itemInventory === "main") {
                disableInventory(500);
                $.post("https://invui/PutIntoVault", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            } else if (type === "player" && itemInventory === "main") {
                disableInventory(500);
                $.post("https://invui/PutIntoPlayer", JSON.stringify({
                    item: itemData,
                    number: parseInt($("#count").val())
                }));
            }
        }
    });

    $("#count").on("keypress keyup blur", function(event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
});

$.widget('ui.dialog', $.ui.dialog, {
    options: {
        // Determine if clicking outside the dialog shall close it
        clickOutside: false,
        // Element (id or class) that triggers the dialog opening 
        clickOutsideTrigger: ''
    },
    open: function() {
        var clickOutsideTriggerEl = $(this.options.clickOutsideTrigger),
            that = this;
        if (this.options.clickOutside) {
            // Add document wide click handler for the current dialog namespace
            $(document).on('click.ui.dialogClickOutside' + that.eventNamespace, function(event) {
                var $target = $(event.target);
                if ($target.closest($(clickOutsideTriggerEl)).length === 0 &&
                    $target.closest($(that.uiDialog)).length === 0) {
                    that.close();
                }
            });
        }
        // Invoke parent open method
        this._super();
    },
    close: function() {
        // Remove document wide click handler for the current dialog
        $(document).off('click.ui.dialogClickOutside' + this.eventNamespace);
        // Invoke parent close method 
        this._super();
    },
});


var config = new Object();
config.closeKeys = [37, 27]; //Array of keys used to close inventory. Default ESC and F2. Check https://keycode.info/ to get your key code
//LANGUAGE CAN BE CHANGED IN ui.html, SEARCH FOR <script src="locales/en.js"></script> AND CHANGE IT THERE
