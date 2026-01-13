from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Chat


@csrf_exempt
def chat_view(request):
    if request.method == 'GET':
        messages = Chat.objects.all().order_by('created_at')
        messages_list = [
            {
                'id': msg.id,
                'name': msg.name,
                'message': msg.message,
                'created_at': msg.created_at.isoformat()
            }
            for msg in messages
        ]
        return JsonResponse({'messages': messages_list}, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            message = data.get('message')
            
            if not name or not message:
                return JsonResponse({'error': 'Name und Message sind erforderlich'}, status=400)
            
            chat = Chat.objects.create(name=name, message=message)
            
            return JsonResponse({
                'id': chat.id,
                'name': chat.name,
                'message': chat.message,
                'created_at': chat.created_at.isoformat()
            }, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Ungültiges JSON'}, status=400)
    
    return JsonResponse({'error': 'Methode nicht erlaubt'}, status=405)
