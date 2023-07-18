import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def sendEmail(email, subject, body, link):
    # Set up the SMTP server
    sender = 'noreply.facerec@gmail.com'
    password = "kstyjqnlyeminzfn"
    
    s = smtplib.SMTP(host='smtp.gmail.com', port=587)
    s.starttls()
    s.login(sender, password)

    # Create a MIMEMultipart message object
    msg = MIMEMultipart()

    # Set up the parameters of the message
    msg['From'] = sender
    msg['To'] = email
    msg['Subject'] = subject

    # Add your message body
    message = body + "\n" + link
    msg.attach(MIMEText(message, 'plain'))

    # Send the message using the SMTP server object
    s.send_message(msg)
    s.quit()