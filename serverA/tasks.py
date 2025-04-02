from datetime import datetime, timedelta
#from celery.schedules import crontab
from celery import Celery
from flask_mailman import EmailMessage

from factory import create_app,mail
from models import User, Quiz, Score

from celery.schedules import crontab
import csv
from io import StringIO
#from xhtml2pdf import pisa
from io import BytesIO

def make_celery():
    app = create_app()
    
    celery = Celery(
        'tasks',
        broker='redis://localhost:6379/0',
        backend='redis://localhost:6379/0'
    )
    
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
            
    celery.conf.update(
        timezone='Asia/Kolkata',  # timezone
        enable_utc=True,
        task_track_started=True,  #task track
        result_expires=3600,  # Expiry 1 hour
    )

    celery.Task = ContextTask
    return celery

celery = make_celery()


# Tasks


@celery.task(name='tasks.send_email', bind=True, max_retries=3,ignore_result=True)
def send_email(self, subject, recipient, body, attachments=None, as_pdf=False):
    """Send email using SMTP with retries"""
    try:
        with mail.get_connection(
            host= 'smtp.gmail.com',
            port= 587,
            username= 'mail.whiz.it@gmail.com',
            password= 'ergptxeyzovqclsh',
            use_tls=    True,
            timeout=    50,
        ) as connection:
            
            
            msg = EmailMessage(
                subject=subject,                
                from_email='mail.whiz.it@gmail.com',
                to=[recipient],
                connection=connection,
                body=body
            )
            #if '<' in body and '>' in body:
            
            # Process HTML content
            if as_pdf:
                # Convert HTML to PDF
                pdf_buffer = BytesIO()
                pisa_status = pisa.CreatePDF(
                    body,               # HTML content
                    dest=pdf_buffer     # Output buffer
                )
                
                if pisa_status.err:
                    # Fallback to HTML email if PDF generation fails
                    msg.body = body
                    msg.content_subtype = "html"
                else:
                    # Set plain text content
                    msg.body = "Please see the attached PDF report."
                    # Attach PDF
                    pdf_buffer.seek(0)
                    msg.attach(
                        f"{subject.replace(' ', '_')}.pdf",
                        pdf_buffer.read(),
                        'application/pdf'
                    )
            else:
                msg.body = body
                msg.content_subtype = "html"
            
            
            if attachments:
                for filename, content, mimetype in attachments:
                    msg.attach(filename, content, mimetype)
                    
            msg.send()
            
        return f"Email sent successfully to {recipient}"
    except ConnectionRefusedError as e:
        # exponential retyrs
        retry_in = 60 * (2 ** self.request.retries)  # 60s, 120s, 240s
        raise self.retry(exc=e, countdown=retry_in, max_retries=3)
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise e
    
# signup message  
@celery.task(name='tasks.signup_msg',ignore_result=True)
def signup_msg(user_id):
    
    user = User.query.get(user_id)
    if not user.email:
        return "User has no email"
    
    html_content = f"""
    <html>
        <body>
            <h2>Welcome to QuizApp,{user.full_name}!</h2>
            <p>Thank you for signing up.</p>
            <p>Start taking quizzes now!</p>
            <table role="presentation" style="margin: 20px 0;">
                <tr>
                    <td align="center">
                        <a href="http://127.0.0.1:5000" 
                        style="padding: 10px 20px; background-color: #64cf68; color: white; text-decoration: none; border: 4px solid white; border-radius:8rem;font-weight:bold; display: inline-block; font-size: 16px;">
                        Take a Quiz🡵</a>
                    </td>
                </tr>
            </table>
        </body>
    </html>
    """
    
    send_email.delay(
        subject="Welcome to QuizApp!",
        recipient=user.email,
        body=html_content
    )
    
    return "Welcome message sent successfully"


## NEW Tasks
@celery.task(name='tasks.send_daily_reminders',ignore_result=True)
def send_daily_reminders():
    """Send daily reminders to inactive users or users with new quizzes"""
    try:
        yesterday = datetime.now() - timedelta(days=1)
        users = User.query.all()
        
        for user in users:
            if not user.email:  # Skip users without email
                continue
                
            datetime_last = user.updated_at
            last_login = datetime_last.replace(tzinfo=None)
            
            if last_login < yesterday:
                new_quizzes = Quiz.query.filter(
                    Quiz.created_at > last_login
                ).all()
                
                if new_quizzes:
                    html_content = f"""
                    <h2>New Quizzes Available!</h2>
                    <p>Hello {user.full_name},</p>
                    <p>There are {len(new_quizzes)} new quizzes available.</p>
                    <p>Login to attempt them!</p>
                    """
                    
                    #send_email.delay(
                       # subject="New Quizzes Available!",
                      #  recipient=user.email,
                       # body=html_content
                    #)
                    # Use the existing send_email task instead of implementing email sending here
                    send_email.delay(
                        subject="New Quizzes Available!",
                        recipient=user.email,
                        body=html_content
                    )
                    
                else:   
                    html_content = f"""
                    <h2>Don't Miss Out!</h2>
                    <p>Hello {user.full_name},</p>
                    <p>It's been a while since you last logged in.</p>
                    <p>Don't miss out on new quizzes!</p>
                    """
                    
                    send_email.delay(
                        subject="Don't Miss Out!",
                        recipient=user.email,
                        body=html_content
                    )
        
        return "Daily reminders sent successfully"
    except Exception as e:
        print(f"Error in daily reminders: {str(e)}")
        raise e

@celery.task(name='tasks.send_monthly_report',ignore_result=True)
def send_monthly_report():
    """Generate and send monthly activity reports"""
    try:
        today = datetime.now()
        #first_of_month = today.replace(day=1)
        #last_month_end = first_of_month - timedelta(days=1)
        #last_month_start = last_month_end.replace(day=1)
        last_month_start = today - timedelta(days=30)
        users = User.query.all()
        
        for user in users:
            if not user.email:  # Skip users without email
                continue
                
            '''monthly_scores = Score.query.filter(
                Score.user_id == user.id,
                Score.created_at.between(last_month_start, last_month_end)
            ).all()'''
            monthly_scores = Score.query.filter(
                Score.user_id == user.id,
                Score.created_at > last_month_start
            ).all()
            print(monthly_scores)
            if monthly_scores:
                total_quizzes = len(monthly_scores)
                avg_score = sum(score.total_score for score in monthly_scores) / total_quizzes
                
                html_content = f"""
                <h2>Monthly Activity Report - {last_month_start.strftime('%B %Y')}</h2>
                <p>Dear {user.full_name},</p>
                <h3>Your Monthly Statistics:</h3>
                <ul>
                    <li>Total Quizzes Taken: {total_quizzes}</li>
                    <li>Average Score: {avg_score:.2f}%</li>
                </ul>
                <h3>Quiz Details:</h3>
                <table border="1">
                    <tr><th>Quiz Id</th><th>Score</th><th>Date</th></tr>
                    {"".join(
                        f"<tr><td>{score.quiz_id}</td>"
                        f"<td>{score.total_score}%</td>"
                        f"<td>{score.created_at.strftime('%Y-%m-%d')}</td></tr>"
                        for score in monthly_scores
                    )}
                </table>
                """
                
                send_email.delay(
                    subject=f"Monthly Activity Report - {last_month_start.strftime('%B %Y')}",
                    recipient=user.email,
                    body=html_content
                )
        
        return "Monthly reports sent successfully"
    except Exception as e:
        print(f"Error in monthly reports: {str(e)}")
        raise e

# user history export mailed
@celery.task(name='tasks.generate_quiz_csv',ignore_result=True)
def generate_quiz_csv(user_id):
    
    try:
        user = User.query.get(user_id)
        if not user or not user.email:
            raise ValueError("User not found or has no email")
            
        scores = Score.query.filter_by(user_id=user_id).all()
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['Quiz ID', 'Chapter ID', 'Date', 'Score', 'Remarks'])
        
        for score in scores:
            writer.writerow([
                score.quiz_id,
                score.quiz.chapter_id,
                score.created_at.strftime('%Y-%m-%d'),
                score.total_score,
            ])
        
        csv_content = output.getvalue()
        output.close()
        
        send_email.delay(
            subject="Your Quiz History Export",
            recipient=user.email,
            body="<p>Please find attached your quiz history export.</p>",
            attachments=[('quiz_history.csv', csv_content, 'text/csv')],
            as_pdf=True
        )
        
        return "CSV generated and sent successfully"
    except Exception as e:
        print(f"Error generating CSV: {str(e)}")
        raise e
    
# user trigg exprot
@celery.task(name='tasks.user_csv')
def user_csv(user_id):
    """Generate CSV export of user's quiz history"""
    try:
        user = User.query.get(user_id)
        if not user:
            raise ValueError("User not found")
            
        scores = Score.query.filter_by(user_id=user_id).all()
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['Quiz ID', 'Chapter ID', 'Date', 'Score', 'Remarks'])
        
        for score in scores:
            writer.writerow([
                score.quiz_id,
                score.quiz.chapter_id,
                score.created_at.strftime('%Y-%m-%d'),
                score.total_score,
            ])
        
        csv_content = output.getvalue()
        output.close()
        
      
        return csv_content
    except Exception as e:
        print(f"Error generating CSV: {str(e)}")
        raise e

        
    


# celery beats
 
'''
@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(86400,send_daily_reminders.s(), name='add everyday')

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(2629800,send_monthly_report.s(), name='add everyday')
'''   
    
'''
celery.conf.beat_schedule = {
    'send_daily_reminders': {
        'task': 'tasks.send_daily_reminders',
        'schedule': crontab(hour=20, minute=00),
    },
    'send_monthly_report': {
        'task': 'tasks.send_monthly_report',
        'schedule': crontab(0, 0, day_of_month='1'),  # First day of each month
    },
   
}
'''
@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=10, minute=55),send_daily_reminders.s(), name='send_daily_reminders'
    )
    sender.add_periodic_task(
        crontab(55, 10, day_of_month='18'),send_monthly_report.s(), name='send_monthly_report'
    )
    #(min/h/doM/MoY/d) Crontab format

@celery.task
def test(arg):
    print(arg)
