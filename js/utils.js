function getRandomInteger(min, max) {
    //max is exclusive
    min = Math.ceil(min);
    max = Math.floor(max); //is ceil w/o +1 an option?
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomIntegerInclusive(min, max) {
    //max is inclusive
    min = Math.ceil(min);
    max = Math.floor(max) + 1; //is ceil w/o +1 an option?
    return Math.floor(Math.random() * (max - min)) + min;
}
function niceCount(num) {
    var leastSignificant = num % 100;
    if (leastSignificant > 10 && leastSignificant < 20) return num + 'th';
    else switch (leastSignificant % 10) {
        case 1:
            return num + 'st';
            break;

        case 2:
            return num + 'nd';
            break;

        case 3:
            return num + 'rd';
            break;

        default:
            return num + 'th';
            break;
    }
    return -1;
}
function rollingAvg(avg, count, nextNum) {
    /**input avg(n), n, num[n+1]*/
    return ((avg * count) + nextNum) / (count + 1);
}
function buildDiv(divClass, divContent) {
    return '<div' + (divClass ? ('class = "' + divClass + '"') : '') + '>' + divContent ? divContent : '' + '</div>\n';
}