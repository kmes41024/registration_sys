<?php
	require_once($_SERVER['DOCUMENT_ROOT'].'encoding.php');
	require_once($_SERVER['DOCUMENT_ROOT'].'db/conn.php');
	require_once($_SERVER['DOCUMENT_ROOT']."mail/sendmail.php");
	require_once($_SERVER['DOCUMENT_ROOT'].'db/jsonResponse.php');
	session_start();

	
	$sqlAttr = array();

	$sqlAttr['f_user_id'] = $_POST['f_user_id'];
	$sqlAttr['f_company_id'] = $_POST['f_company_id'];
	$sqlAttr['f_authorkey_id'] = $_POST['f_authorkey_id'];
	$sqlAttr['f_market_name'] = $_POST['f_market_name'];
	$sqlAttr['f_registry_datetime'] = date("Y-m-d H:i:s");
	
	$sql = "SELECT * FROM `t_member_qn` WHERE `f_qnid` = 145 AND `f_uid` = ".$sqlAttr['f_user_id']." AND `f_state` = '问卷完成'";
	$rs = $conn->execute($sql);
	$len = count($rs);
	
	$maxID = 0;
	for($i = 0; $i < $len; $i++)
	{
		if($rs[$i]['id'] > $maxID)
		{
			$maxID = $rs[$i]['id'];
		}
	}
	
	$sqlAttr['f_cqdata_id'] = $maxID;
	
	$conn->insert('t_aura_registry', $sqlAttr);
	
	$resp = array('state'=>'success');
	echo json_encode($resp, JSON_UNESCAPED_UNICODE);
	exit;
?>