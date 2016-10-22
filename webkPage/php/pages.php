<?php
include_once('connect.php');

$page = intval($_POST['pageNum']);
$result = mysql_query("select id from food");
$total = mysql_num_rows($result);//总记录数

$pageSize = 6; //每页显示数
$totalPage = ceil($total/$pageSize); //总页数

$startPage = $page*$pageSize;
$arr['total'] = $total;
$arr['pageSize'] = $pageSize;
$arr['totalPage'] = $totalPage;
$query = mysql_query("select id,title,pic from food order by id asc limit $startPage,$pageSize");
while($row=mysql_fetch_array($query)){
	 $arr['list'][] = array(
	 	'id' => $row['id'],
		'title' => $row['title'],
		'pic' => $row['pic'],
	 );
}
//print_r($arr);
echo json_encode($arr);
?>