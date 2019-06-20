<?php
if ($_POST) {
    $json = array();
    function throwError($text) {
        $json['error'] = $text;
        echo json_encode($json);
        die();
        return false;
    }
    
	if(isset($_POST['google_token']) && !empty($_POST['google_token'])) {
		$secret = 'zdes_super_secretnyi_kluch';
		$verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$_POST['google_token']);
		$responseData = json_decode($verifyResponse);
		if($responseData->success){
			// автоматом перейдём к формированию письма
		} else {
			 throwError("Ошибка ключа google recaptcha!");
		}
	} else {
		throwError("Google Recaptcha не выполнена. Вы похожи на робота! Пожалуйста, свяжитесь с нами по телефону +7 (3952) 96-65-12");
	}
    
	
    if (!isset($_POST['opd']) || $_POST['opd'] !== 'yasss') {
        throwError('Пожалуйста, подтвердите своё согласие на обработку персональных данных!');
    } else {
        $letterBody;
        $email = 'mirenva@mail.ru';
        $subject;

        switch ($_POST['form-id']) {
            case 'callback':
                $form_id = "\"Отправить груз\"";
                break;
            case 'faq':
                $form_id = "\"Задать вопрос\"";
                break;
            case 'calculation':
                $form_id = "\"Калькулятор стоимости авиадоставки\"";
                break;
            default:
                throwError("Произошла ошибка при отправке письма!");
                break;
        }

		$letterBody = "<h4>Это письмо отправлено с формы " . $form_id . "</h4>
			<p>Имя отправителя: <em>{$_POST['name']}</em></p>";
		$letterBody .= "<p>Номер телефона: <em>{$_POST['phone']}</em></p>";
		if ($_POST['question']!=="") {
			$letterBody .= "<p>Сообщение:</p><p><em>{$_POST['question']}</em></p>";
		}
		if ($_POST['form-id'] == 'calculation') {
			$letterBody .= "<p>Данные из калькулятора:<br/><em>" . nl2br($_POST['calculation']) . "</em></p>";
		}
		$letterBody .= "<br /><hr /><p>Страница, с которой отправлено письмо: <a href=\"{$_POST['url']}\" target=\"_blank\">{$_POST['url']}</a></p>";
		$subject = "Письмо от посетителя сайта {$_SERVER['HTTP_HOST']}";

        if (!$letterBody) throwError('Вы зaпoлнили нe всe пoля!');

        function mime_header_encode($str, $data_charset, $send_charset) {
            if ($data_charset != $send_charset) {
                $str=iconv($data_charset,$send_charset.'//IGNORE',$str);
            }
            return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
        }

        class TEmail {
            public $from_email;
            public $from_name;
            public $to_email;
            public $to_name;
            public $subject;
            public $data_charset='UTF-8';
            public $send_charset='windows-1251';
            public $body='';
            public $type='text/html';

            function send() {
                $dc=$this->data_charset;
                $sc=$this->send_charset;
                $enc_to=mime_header_encode($this->to_name,$dc,$sc).' <'.$this->to_email.'>';
                $enc_subject=mime_header_encode($this->subject,$dc,$sc);
                $enc_from=mime_header_encode($this->from_name,$dc,$sc).' <'.$this->from_email.'>';
                $enc_body=$dc==$sc?$this->body:iconv($dc,$sc.'//IGNORE',$this->body);
                $headers='';
                $headers.="Mime-Version: 1.0\r\n";
                $headers.="Content-type: ".$this->type."; charset=".$sc."\r\n";
                $headers.="From: ".$enc_from."\r\n";
                return mail($enc_to,$enc_subject,$enc_body,$headers);
            }
        }

        $emailgo= new TEmail;
        $emailgo->from_email= 'no-reply';
        $emailgo->from_name= $_SERVER['HTTP_HOST'];
        $emailgo->to_email= $email;
        $emailgo->to_name= $name;
        $emailgo->subject= $subject;
        $emailgo->body= $letterBody;
        $emailgo->send();
        $json['error'] = 0;
        echo json_encode($json);
    }
} else {
    echo '<h1>Прочь с глаз моих! [=_=]</h1>';
}
?>