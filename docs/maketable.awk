#! /usr/bin/awk -f
BEGIN{
    FS="\t"
    OFS="\t|"
}
{
    $1="|"$1;
    $NF=$NF"|";
    print;
}
FNR==1 {
    col = NF
    while(col-->1){
        printf "|---"
    }
    print "|---|"
}