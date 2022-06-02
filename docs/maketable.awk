#! /usr/bin/awk -f
BEGIN{
    IF="\t"
    OFS="\t|"
    col = NF
}
{
    $1="|"$1;
    $NF=$NF"|";
    print;
}
FNR==2 {
    print col
    while(col>0){
        print "|---|";
        col--;
    }
}