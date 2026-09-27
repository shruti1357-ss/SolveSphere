from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Sum
from challenges.models import Challenge
from solutions.models import Solution
from mongodb_config import MongoChallenge, MongoSolution


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def admin_dashboard_analytics(request):
    """
    Analytics Endpoint for Government Official Dashboard & Admin Portal.
    MongoDB Atlas primary with SQLite fallback.
    """
    mongo_challenges = []
    try:
        mongo_challenges = list(MongoChallenge.objects.all())
    except Exception as e:
        print(f"[MONGODB ANALYTICS WARNING] {e}")

    if mongo_challenges:
        total_challenges = len(mongo_challenges)
        open_challenges = sum(1 for c in mongo_challenges if c.status in ['OPEN', 'PENDING', 'SUBMITTED'])
        assigned_challenges = sum(1 for c in mongo_challenges if c.status in ['ASSIGNED_TO_HEI', 'ASSIGNED'])
        in_progress_challenges = sum(1 for c in mongo_challenges if c.status in ['IN_PROGRESS', 'DEVELOPMENT', 'TESTING'])
        resolved_challenges = sum(1 for c in mongo_challenges if c.status in ['RESOLVED', 'DEPLOYED', 'COMPLETED'])

        # Category breakdown
        cat_map = {}
        for c in mongo_challenges:
            cat = c.category or "General Civic Issue"
            cat_map[cat] = cat_map.get(cat, 0) + 1
        category_counts = [{"category": k, "count": v} for k, v in sorted(cat_map.items(), key=lambda x: x[1], reverse=True)]

        # District breakdown
        dist_map = {}
        for c in mongo_challenges:
            dist = c.district or "Ranchi"
            dist_map[dist] = dist_map.get(dist, 0) + 1
        district_counts = [{"district": k, "count": v} for k, v in sorted(dist_map.items(), key=lambda x: x[1], reverse=True)]

        # Total CSR Grants & Solutions from MongoSolution
        total_solutions = 0
        total_csr_pledged = 0.0
        try:
            mongo_solutions = list(MongoSolution.objects.all())
            total_solutions = len(mongo_solutions)
            total_csr_pledged = sum(float(s.csr_grant_amount or 0.0) for s in mongo_solutions)
        except Exception:
            pass

        if not total_solutions:
            total_solutions = Solution.objects.count()
            total_csr_pledged = Solution.objects.aggregate(total=Sum('csr_grant_amount'))['total'] or 0.0

        resolution_rate = round((resolved_challenges / total_challenges * 100), 1) if total_challenges > 0 else 0.0

        return Response({
            "state": "Jharkhand",
            "summary": {
                "total_challenges": total_challenges,
                "open_challenges": open_challenges,
                "assigned_to_heis": assigned_challenges,
                "in_progress": in_progress_challenges,
                "resolved": resolved_challenges,
                "resolution_rate_percent": resolution_rate,
                "total_solutions_submitted": total_solutions,
                "total_csr_funds_pledged_inr": float(total_csr_pledged)
            },
            "category_breakdown": category_counts,
            "district_breakdown": district_counts,
            "participating_heis_count": 8,
            "active_csr_partners_count": 5
        }, status=status.HTTP_200_OK)

    # SQLite fallback
    total_challenges = Challenge.objects.count()
    open_challenges = Challenge.objects.filter(status='OPEN').count()
    assigned_challenges = Challenge.objects.filter(status='ASSIGNED_TO_HEI').count()
    in_progress_challenges = Challenge.objects.filter(status='IN_PROGRESS').count()
    resolved_challenges = Challenge.objects.filter(status='RESOLVED').count()

    category_counts = Challenge.objects.values('category').annotate(count=Count('id')).order_by('-count')
    district_counts = Challenge.objects.values('district').annotate(count=Count('id')).order_by('-count')

    total_solutions = Solution.objects.count()
    total_csr_pledged = Solution.objects.aggregate(total=Sum('csr_grant_amount'))['total'] or 0.0

    resolution_rate = round((resolved_challenges / total_challenges * 100), 1) if total_challenges > 0 else 0.0

    return Response({
        "state": "Jharkhand",
        "summary": {
            "total_challenges": total_challenges,
            "open_challenges": open_challenges,
            "assigned_to_heis": assigned_challenges,
            "in_progress": in_progress_challenges,
            "resolved": resolved_challenges,
            "resolution_rate_percent": resolution_rate,
            "total_solutions_submitted": total_solutions,
            "total_csr_funds_pledged_inr": float(total_csr_pledged)
        },
        "category_breakdown": category_counts,
        "district_breakdown": district_counts,
        "participating_heis_count": 8,
        "active_csr_partners_count": 5
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def gis_heatmap_data(request):
    """
    GIS Heatmap Dataset Endpoint for MapmyIndia / Leaflet / ISRO Bhuvan mapping.
    MongoDB Atlas primary with SQLite fallback.
    """
    district_filter = request.query_params.get('district')
    
    # MongoDB Atlas primary
    try:
        qs = MongoChallenge.objects.all()
        if district_filter:
            qs = qs.filter(district__iexact=district_filter)
        mongo_challenges = list(qs)
        if mongo_challenges:
            features = []
            for c in mongo_challenges:
                lat = 23.3441
                lon = 85.3096
                if c.location and 'coordinates' in c.location:
                    lon, lat = c.location['coordinates'][0], c.location['coordinates'][1]
                features.append({
                    "id": str(c.id),
                    "problem_id": c.problem_id or f"CHL-2026-{str(c.id)[-5:]}",
                    "title": c.title,
                    "category": c.category,
                    "district": c.district,
                    "status": c.status,
                    "urgency_score": c.urgency_score,
                    "upvotes": getattr(c, 'upvotes', 0),
                    "coordinates": [lon, lat], # [lng, lat] GeoJSON format
                    "assigned_university": getattr(c, 'assigned_university', None)
                })
            return Response({
                "type": "FeatureCollection",
                "count": len(features),
                "features": features
            }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"[MONGODB HEATMAP WARNING] {e}")

    # SQLite fallback
    queryset = Challenge.objects.all()
    if district_filter:
        queryset = queryset.filter(district__iexact=district_filter)

    features = []
    for c in queryset:
        features.append({
            "id": c.id,
            "problem_id": getattr(c, 'problem_id', f"CHL-2026-00{c.id}"),
            "title": c.title,
            "category": c.category,
            "district": c.district,
            "status": c.status,
            "urgency_score": c.urgency_score,
            "upvotes": c.upvotes,
            "coordinates": [c.longitude, c.latitude],
            "assigned_university": c.assigned_university
        })

    return Response({
        "type": "FeatureCollection",
        "count": len(features),
        "features": features
    }, status=status.HTTP_200_OK)
