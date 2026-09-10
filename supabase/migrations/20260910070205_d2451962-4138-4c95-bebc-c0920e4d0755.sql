-- 1. EQUIPMENT
INSERT INTO public.equipment (name, slug) VALUES
  ('Pull-up Bar','pull_up_bar'),
  ('Gymnastic Rings','rings'),
  ('Parallettes','parallettes'),
  ('Resistance Band','resistance_band'),
  ('Mat','mat'),
  ('Weights','weights'),
  ('Bench','bench'),
  ('Cable Machine','cable_machine'),
  ('Wall','wall')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 2. SKILLS
INSERT INTO public.skills (name, slug) VALUES
  ('Muscle-up','muscle_up'),
  ('Front Lever','front_lever'),
  ('Handstand','handstand'),
  ('Handstand Push-up','hspu'),
  ('Planche','planche'),
  ('L-sit','l_sit')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 3. SKILL COMPONENTS
INSERT INTO public.skill_components (skill_id, name, slug)
SELECT s.id, v.name, v.slug
FROM (VALUES
  ('muscle_up','Pull Strength','pull_strength'),
  ('muscle_up','Explosive Pull','explosive_pull'),
  ('muscle_up','Pull Height','pull_height'),
  ('muscle_up','Transition','transition'),
  ('muscle_up','Straight Bar Dip','straight_bar_dip'),
  ('muscle_up','Core Control','core_control'),
  ('muscle_up','Technique','technique'),
  ('front_lever','Straight Arm Pull','straight_arm_pull'),
  ('front_lever','Lat Strength','lat_strength'),
  ('front_lever','Scapular Depression','scapular_depression'),
  ('front_lever','Posterior Core','posterior_core'),
  ('front_lever','Bodyline','bodyline'),
  ('front_lever','Hip Extension','hip_extension'),
  ('front_lever','Position Endurance','position_endurance')
) AS v(skill_slug,name,slug)
JOIN public.skills s ON s.slug = v.skill_slug
ON CONFLICT (skill_id, slug) DO UPDATE SET name = EXCLUDED.name;

-- 4. TRAINING INTENTS
INSERT INTO public.training_intents (name, slug, movement_family) VALUES
  ('Max Vertical Pull Strength','max_vertical_pull_strength','vertical_pull'),
  ('Explosive Vertical Pull','explosive_vertical_pull','vertical_pull'),
  ('Muscle-up Pull Height','muscle_up_pull_height','vertical_pull'),
  ('Muscle-up Transition','muscle_up_transition','transition'),
  ('Front Lever Strength','front_lever_strength','straight_arm_pull'),
  ('Horizontal Pull Volume','horizontal_pull_volume','horizontal_pull'),
  ('Posterior Core Strength','posterior_core_strength','posterior_core'),
  ('Anterior Core Strength','anterior_core_strength','anterior_core'),
  ('Compression Strength','compression_strength','anterior_core'),
  ('Pull Prehab','pull_prehab','scapular')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, movement_family = EXCLUDED.movement_family;

-- 5/6. EXERCISES
INSERT INTO public.exercises
  (name, slug, category, movement_family, exercise_role, difficulty, rep_type,
   min_reps, max_reps, min_hold_seconds, max_hold_seconds, default_rir,
   default_rest_seconds, fatigue_cost, surface_requirement, active)
VALUES
  ('Pull-up','pull_up','pull','vertical_pull','primary',4,'reps',3,12,NULL,NULL,2,150,3,'any',true),
  ('Weighted Pull-up','weighted_pull_up','pull','vertical_pull','primary',6,'reps',3,6,NULL,NULL,1,180,4,'any',true),
  ('Archer Pull-up','archer_pull_up','pull','vertical_pull','primary',6,'reps',2,6,NULL,NULL,1,180,4,'any',true),
  ('Chest-to-bar Pull-up','chest_to_bar_pull_up','pull','vertical_pull','primary',5,'reps',3,8,NULL,NULL,2,150,3,'any',true),
  ('Explosive Pull-up','explosive_pull_up','pull','vertical_pull','primary',6,'reps',3,6,NULL,NULL,2,180,3,'any',true),
  ('High Pull-up','high_pull_up','pull','vertical_pull','primary',7,'reps',2,5,NULL,NULL,2,180,3,'any',true),
  ('Australian Pull-up','australian_pull_up','pull','horizontal_pull','secondary',2,'reps',6,15,NULL,NULL,2,90,2,'any',true),
  ('Ring Row','ring_row','pull','horizontal_pull','secondary',3,'reps',6,15,NULL,NULL,2,90,2,'any',true),
  ('Feet-elevated Ring Row','feet_elevated_ring_row','pull','horizontal_pull','secondary',4,'reps',5,12,NULL,NULL,2,120,3,'any',true),
  ('Scapular Pull-up','scapular_pull_up','pull','scapular','prehab',2,'reps',5,12,NULL,NULL,3,60,1,'any',true),
  ('Tuck Front Lever','tuck_front_lever','pull','straight_arm_pull','primary',5,'hold',NULL,NULL,5,20,NULL,120,3,'any',true),
  ('Advanced Tuck Front Lever','advanced_tuck_front_lever','pull','straight_arm_pull','primary',6,'hold',NULL,NULL,5,15,NULL,150,3,'any',true),
  ('One-leg Front Lever','one_leg_front_lever','pull','straight_arm_pull','primary',7,'hold',NULL,NULL,5,12,NULL,150,4,'any',true),
  ('Band-assisted Front Lever','band_assisted_front_lever','pull','straight_arm_pull','primary',6,'hold',NULL,NULL,5,15,NULL,150,3,'any',true),
  ('Front Lever Raise','front_lever_raise','pull','straight_arm_pull','primary',7,'reps',3,8,NULL,NULL,2,150,4,'any',true),
  ('Low-bar Muscle-up Transition','low_bar_muscle_up_transition','pull','transition','skill',5,'reps',3,6,NULL,NULL,3,120,2,'any',true),
  ('Band Muscle-up Transition','band_muscle_up_transition','pull','transition','skill',5,'reps',3,6,NULL,NULL,3,120,2,'any',true),
  ('Negative Muscle-up','negative_muscle_up','pull','transition','skill',6,'reps',2,5,NULL,NULL,2,150,3,'any',true),
  ('Assisted Muscle-up','assisted_muscle_up','pull','transition','skill',6,'reps',2,5,NULL,NULL,2,150,3,'any',true),
  ('Strict Muscle-up','strict_muscle_up','pull','transition','primary',8,'reps',1,4,NULL,NULL,1,180,4,'any',true),
  ('Hanging Knee Raise','hanging_knee_raise','core','anterior_core','accessory',2,'reps',8,15,NULL,NULL,2,90,2,'any',true),
  ('Hanging Leg Raise','hanging_leg_raise','core','anterior_core','accessory',4,'reps',5,12,NULL,NULL,2,90,2,'any',true),
  ('Dragon Flag','dragon_flag','core','posterior_core','accessory',7,'reps',3,6,NULL,NULL,2,120,3,'elevated_support',true),
  ('Dragon Flag Negative','dragon_flag_negative','core','posterior_core','accessory',6,'reps',3,6,NULL,NULL,2,120,3,'elevated_support',true),
  ('Reverse Plank','reverse_plank','core','posterior_core','accessory',2,'hold',NULL,NULL,20,45,NULL,60,1,'soft_preferred',true),
  ('Ring Bodyline Extension','ring_bodyline_extension','core','bodyline','accessory',4,'hold',NULL,NULL,10,30,NULL,90,2,'any',true),
  ('Side Plank','side_plank','core','lateral_core','accessory',2,'hold',NULL,NULL,20,45,NULL,60,1,'soft_preferred',true),
  ('Ring Anti-rotation Hold','ring_anti_rotation_hold','core','lateral_core','accessory',4,'hold',NULL,NULL,10,25,NULL,90,2,'any',true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, movement_family = EXCLUDED.movement_family,
  exercise_role = EXCLUDED.exercise_role, difficulty = EXCLUDED.difficulty, rep_type = EXCLUDED.rep_type,
  min_reps = EXCLUDED.min_reps, max_reps = EXCLUDED.max_reps,
  min_hold_seconds = EXCLUDED.min_hold_seconds, max_hold_seconds = EXCLUDED.max_hold_seconds,
  default_rir = EXCLUDED.default_rir, default_rest_seconds = EXCLUDED.default_rest_seconds,
  fatigue_cost = EXCLUDED.fatigue_cost, surface_requirement = EXCLUDED.surface_requirement,
  active = EXCLUDED.active, updated_at = now();

-- 7. EQUIPMENT RELATIONS
INSERT INTO public.exercise_equipment (exercise_id, equipment_id, requirement_type)
SELECT e.id, q.id, v.req::equipment_requirement_type
FROM (VALUES
  ('pull_up','pull_up_bar','required'),
  ('weighted_pull_up','pull_up_bar','required'),
  ('weighted_pull_up','weights','required'),
  ('archer_pull_up','pull_up_bar','required'),
  ('chest_to_bar_pull_up','pull_up_bar','required'),
  ('explosive_pull_up','pull_up_bar','required'),
  ('high_pull_up','pull_up_bar','required'),
  ('scapular_pull_up','pull_up_bar','required'),
  ('australian_pull_up','pull_up_bar','required'),
  ('ring_row','rings','required'),
  ('feet_elevated_ring_row','rings','required'),
  ('feet_elevated_ring_row','bench','optional'),
  ('tuck_front_lever','pull_up_bar','required'),
  ('advanced_tuck_front_lever','pull_up_bar','required'),
  ('one_leg_front_lever','pull_up_bar','required'),
  ('band_assisted_front_lever','pull_up_bar','required'),
  ('band_assisted_front_lever','resistance_band','required'),
  ('front_lever_raise','pull_up_bar','required'),
  ('low_bar_muscle_up_transition','pull_up_bar','required'),
  ('band_muscle_up_transition','pull_up_bar','required'),
  ('band_muscle_up_transition','resistance_band','required'),
  ('negative_muscle_up','pull_up_bar','required'),
  ('assisted_muscle_up','pull_up_bar','required'),
  ('assisted_muscle_up','resistance_band','optional'),
  ('strict_muscle_up','pull_up_bar','required'),
  ('hanging_knee_raise','pull_up_bar','required'),
  ('hanging_leg_raise','pull_up_bar','required'),
  ('dragon_flag','bench','required'),
  ('dragon_flag_negative','bench','required'),
  ('reverse_plank','mat','optional'),
  ('side_plank','mat','optional'),
  ('ring_bodyline_extension','rings','required'),
  ('ring_anti_rotation_hold','rings','required')
) AS v(ex,eq,req)
JOIN public.exercises e ON e.slug = v.ex
JOIN public.equipment q ON q.slug = v.eq
ON CONFLICT (exercise_id, equipment_id) DO UPDATE SET requirement_type = EXCLUDED.requirement_type;

-- 8. EXERCISE -> SKILL RELATIONS (0-30)
INSERT INTO public.exercise_skill_relations (exercise_id, skill_id, relevance)
SELECT e.id, s.id, v.rel
FROM (VALUES
  ('strict_muscle_up','muscle_up',30),
  ('assisted_muscle_up','muscle_up',28),
  ('negative_muscle_up','muscle_up',27),
  ('band_muscle_up_transition','muscle_up',26),
  ('low_bar_muscle_up_transition','muscle_up',25),
  ('high_pull_up','muscle_up',26),
  ('explosive_pull_up','muscle_up',24),
  ('chest_to_bar_pull_up','muscle_up',22),
  ('weighted_pull_up','muscle_up',18),
  ('pull_up','muscle_up',16),
  ('archer_pull_up','muscle_up',15),
  ('scapular_pull_up','muscle_up',8),
  ('hanging_leg_raise','muscle_up',8),
  ('hanging_knee_raise','muscle_up',6),
  ('ring_bodyline_extension','muscle_up',6),
  ('tuck_front_lever','front_lever',26),
  ('advanced_tuck_front_lever','front_lever',28),
  ('one_leg_front_lever','front_lever',29),
  ('band_assisted_front_lever','front_lever',26),
  ('front_lever_raise','front_lever',27),
  ('scapular_pull_up','front_lever',14),
  ('dragon_flag','front_lever',18),
  ('dragon_flag_negative','front_lever',16),
  ('ring_bodyline_extension','front_lever',14),
  ('pull_up','front_lever',10),
  ('weighted_pull_up','front_lever',9),
  ('ring_row','front_lever',8),
  ('feet_elevated_ring_row','front_lever',9),
  ('australian_pull_up','front_lever',7),
  ('reverse_plank','front_lever',6),
  ('hanging_leg_raise','front_lever',7),
  ('side_plank','front_lever',5),
  ('ring_anti_rotation_hold','front_lever',6)
) AS v(ex,sk,rel)
JOIN public.exercises e ON e.slug = v.ex
JOIN public.skills s ON s.slug = v.sk
ON CONFLICT (exercise_id, skill_id) DO UPDATE SET relevance = EXCLUDED.relevance;

-- 9. EXERCISE -> COMPONENT RELATIONS (0-25)
INSERT INTO public.exercise_component_relations (exercise_id, component_id, relevance)
SELECT e.id, c.id, v.rel
FROM (VALUES
  ('pull_up','muscle_up','pull_strength',18),
  ('weighted_pull_up','muscle_up','pull_strength',25),
  ('weighted_pull_up','muscle_up','explosive_pull',8),
  ('archer_pull_up','muscle_up','pull_strength',21),
  ('chest_to_bar_pull_up','muscle_up','pull_height',18),
  ('chest_to_bar_pull_up','muscle_up','pull_strength',15),
  ('explosive_pull_up','muscle_up','explosive_pull',24),
  ('explosive_pull_up','muscle_up','pull_height',18),
  ('high_pull_up','muscle_up','pull_height',25),
  ('high_pull_up','muscle_up','explosive_pull',24),
  ('high_pull_up','muscle_up','pull_strength',13),
  ('low_bar_muscle_up_transition','muscle_up','transition',23),
  ('low_bar_muscle_up_transition','muscle_up','technique',20),
  ('band_muscle_up_transition','muscle_up','transition',25),
  ('band_muscle_up_transition','muscle_up','technique',21),
  ('negative_muscle_up','muscle_up','transition',22),
  ('negative_muscle_up','muscle_up','technique',17),
  ('assisted_muscle_up','muscle_up','transition',21),
  ('assisted_muscle_up','muscle_up','technique',18),
  ('assisted_muscle_up','muscle_up','straight_bar_dip',12),
  ('strict_muscle_up','muscle_up','transition',24),
  ('strict_muscle_up','muscle_up','technique',22),
  ('strict_muscle_up','muscle_up','straight_bar_dip',16),
  ('strict_muscle_up','muscle_up','pull_strength',16),
  ('hanging_knee_raise','muscle_up','core_control',12),
  ('hanging_leg_raise','muscle_up','core_control',16),
  ('ring_bodyline_extension','muscle_up','core_control',13),
  ('scapular_pull_up','muscle_up','pull_strength',8),
  ('scapular_pull_up','front_lever','scapular_depression',25),
  ('scapular_pull_up','front_lever','straight_arm_pull',12),
  ('tuck_front_lever','front_lever','straight_arm_pull',22),
  ('tuck_front_lever','front_lever','lat_strength',20),
  ('tuck_front_lever','front_lever','scapular_depression',16),
  ('tuck_front_lever','front_lever','position_endurance',18),
  ('advanced_tuck_front_lever','front_lever','straight_arm_pull',23),
  ('advanced_tuck_front_lever','front_lever','lat_strength',21),
  ('advanced_tuck_front_lever','front_lever','bodyline',17),
  ('advanced_tuck_front_lever','front_lever','position_endurance',19),
  ('one_leg_front_lever','front_lever','straight_arm_pull',24),
  ('one_leg_front_lever','front_lever','lat_strength',22),
  ('one_leg_front_lever','front_lever','bodyline',19),
  ('one_leg_front_lever','front_lever','hip_extension',14),
  ('one_leg_front_lever','front_lever','position_endurance',20),
  ('band_assisted_front_lever','front_lever','straight_arm_pull',21),
  ('band_assisted_front_lever','front_lever','bodyline',20),
  ('band_assisted_front_lever','front_lever','position_endurance',18),
  ('front_lever_raise','front_lever','straight_arm_pull',23),
  ('front_lever_raise','front_lever','lat_strength',20),
  ('front_lever_raise','front_lever','posterior_core',15),
  ('dragon_flag','front_lever','posterior_core',25),
  ('dragon_flag','front_lever','bodyline',20),
  ('dragon_flag','front_lever','hip_extension',14),
  ('dragon_flag_negative','front_lever','posterior_core',22),
  ('dragon_flag_negative','front_lever','bodyline',18),
  ('ring_bodyline_extension','front_lever','bodyline',20),
  ('ring_bodyline_extension','front_lever','posterior_core',14),
  ('reverse_plank','front_lever','hip_extension',13),
  ('reverse_plank','front_lever','posterior_core',10),
  ('hanging_leg_raise','front_lever','posterior_core',8),
  ('side_plank','front_lever','bodyline',8),
  ('ring_anti_rotation_hold','front_lever','bodyline',10),
  ('ring_row','front_lever','lat_strength',10),
  ('feet_elevated_ring_row','front_lever','lat_strength',12),
  ('australian_pull_up','front_lever','lat_strength',9),
  ('pull_up','front_lever','lat_strength',12),
  ('weighted_pull_up','front_lever','lat_strength',13)
) AS v(ex,sk,comp,rel)
JOIN public.exercises e ON e.slug = v.ex
JOIN public.skills s ON s.slug = v.sk
JOIN public.skill_components c ON c.skill_id = s.id AND c.slug = v.comp
ON CONFLICT (exercise_id, component_id) DO UPDATE SET relevance = EXCLUDED.relevance;

-- 10. EXERCISE -> TRAINING INTENT RELATIONS (0-20)
INSERT INTO public.exercise_training_intents (exercise_id, training_intent_id, fit_score)
SELECT e.id, t.id, v.fit
FROM (VALUES
  ('weighted_pull_up','max_vertical_pull_strength',20),
  ('archer_pull_up','max_vertical_pull_strength',17),
  ('pull_up','max_vertical_pull_strength',13),
  ('chest_to_bar_pull_up','max_vertical_pull_strength',12),
  ('strict_muscle_up','max_vertical_pull_strength',11),
  ('explosive_pull_up','explosive_vertical_pull',20),
  ('high_pull_up','explosive_vertical_pull',19),
  ('chest_to_bar_pull_up','explosive_vertical_pull',12),
  ('high_pull_up','muscle_up_pull_height',20),
  ('explosive_pull_up','muscle_up_pull_height',17),
  ('chest_to_bar_pull_up','muscle_up_pull_height',14),
  ('band_muscle_up_transition','muscle_up_transition',20),
  ('low_bar_muscle_up_transition','muscle_up_transition',18),
  ('negative_muscle_up','muscle_up_transition',17),
  ('assisted_muscle_up','muscle_up_transition',17),
  ('strict_muscle_up','muscle_up_transition',16),
  ('tuck_front_lever','front_lever_strength',18),
  ('advanced_tuck_front_lever','front_lever_strength',19),
  ('one_leg_front_lever','front_lever_strength',20),
  ('band_assisted_front_lever','front_lever_strength',18),
  ('front_lever_raise','front_lever_strength',19),
  ('scapular_pull_up','front_lever_strength',9),
  ('ring_row','horizontal_pull_volume',19),
  ('australian_pull_up','horizontal_pull_volume',18),
  ('feet_elevated_ring_row','horizontal_pull_volume',20),
  ('dragon_flag','posterior_core_strength',19),
  ('dragon_flag_negative','posterior_core_strength',17),
  ('ring_bodyline_extension','posterior_core_strength',13),
  ('reverse_plank','posterior_core_strength',10),
  ('hanging_leg_raise','anterior_core_strength',19),
  ('hanging_knee_raise','anterior_core_strength',15),
  ('ring_anti_rotation_hold','anterior_core_strength',12),
  ('side_plank','anterior_core_strength',9),
  ('hanging_leg_raise','compression_strength',14),
  ('hanging_knee_raise','compression_strength',10),
  ('scapular_pull_up','pull_prehab',18),
  ('ring_row','pull_prehab',10),
  ('reverse_plank','pull_prehab',8)
) AS v(ex,ti,fit)
JOIN public.exercises e ON e.slug = v.ex
JOIN public.training_intents t ON t.slug = v.ti
ON CONFLICT (exercise_id, training_intent_id) DO UPDATE SET fit_score = EXCLUDED.fit_score;